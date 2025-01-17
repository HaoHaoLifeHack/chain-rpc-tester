import { executeRpcCall } from '../utils/rpc.utils.js';
import { rpcTests } from '../config/rpc.test.config.js';
import { executeTest } from './testUtils.js';

// ===== Core Functions =====
export const runAllTests = async (endpoint) => {
  try {
    await executeTestCategory(endpoint, 'Block Tests', rpcTests.blockTests);
    await executeTestCategory(endpoint, 'Transaction Tests', rpcTests.transactionTests);
    await executeTestCategory(endpoint, 'EVM Tests', rpcTests.evmTests);
    await executeTestCategory(endpoint, 'Account Tests', rpcTests.accountTests);
    await executeTestCategory(endpoint, 'Event Tests', rpcTests.eventTests);
    await executeTestCategory(endpoint, 'Chain Tests', rpcTests.chainTests);
    await executeTestCategory(endpoint, 'Uncle Tests', rpcTests.uncleTests);
    await executeTestCategory(endpoint, 'Gas Estimation Tests', rpcTests.gasTests);
    await executeTestCategory(endpoint, 'Tx Pool Tests', rpcTests.txpoolTests);
    await executeTestCategory(endpoint, 'Web3 Tests', rpcTests.web3Tests);
    await executeTestCategory(endpoint, 'Debug API Tests', rpcTests.debugTests);
  } catch (error) {
    console.error('Test execution failed:', error);
  }
};

const executeTestCategory = async (endpoint, categoryName, categoryTests) => {
  console.log(`\n=== Running ${categoryName} ===`);
  const results = [];

  // Handle block data initialization
  if (needsBlockData(categoryName)) {
    const blockData = await initializeBlockData(endpoint);
    if (blockData) {
      configureCategoryTests(categoryName, categoryTests, blockData);
    }
  }

  // Handle filter tests
  if (categoryName === 'Event Tests') {
    const { results: filterResults, filterId: newFilterId } = await executeFilterTests(endpoint, categoryTests, results);
    await cleanupFilter(endpoint, newFilterId);
    return filterResults;
  }

  // Execute regular tests
  for (const [testName, testConfig] of Object.entries(categoryTests)) {
    results.push(await executeTest(endpoint, testName, testConfig));
  }

  return results;
};

// ===== Block Data Handling =====
const initializeBlockData = async (endpoint) => {
  try {
    const block = await executeRpcCall(endpoint, 'eth_getBlockByNumber', ['latest', true]);
    if (!block || !block.hash) return null;
    
    const txHash = block.transactions?.[0]?.hash || null;
    console.log('block.number: ', block.number);
    return { block, blockHash: block.hash, txHash };
  } catch (error) {
    console.error('Failed to get block data:', error);
    return null;
  }
};

const needsBlockData = (categoryName) => {
  const categoriesNeedingBlock = [
    'Block Tests',
    'Debug API Tests',
    'Uncle Tests',
    'Transaction Tests'
  ];
  return categoriesNeedingBlock.includes(categoryName);
};

// ===== Category Configuration =====
const configureCategoryTests = (categoryName, categoryTests, blockData) => {
  const { block, blockHash } = blockData;
  const configMap = {
    'Block Tests': () => configureBlockData(categoryTests, blockHash),
    'Transaction Tests': () => configureTransactionTest(categoryTests, block, blockHash),
    'Debug API Tests': () => configureDebugTest(categoryTests, block),
    'Uncle Tests': () => configureUncleTest(categoryTests, blockHash)
  };

  const configureFunc = configMap[categoryName];
  if (configureFunc) {
    configureFunc();
  }
};

const configureBlockData = (categoryTests, blockHash) => {
  if (categoryTests.eth_getBlockByHash) {
    categoryTests.eth_getBlockByHash.params = [blockHash, true];
  }
  if (categoryTests.eth_getBlockTransactionCountByHash) {
    categoryTests.eth_getBlockTransactionCountByHash.params = [blockHash];
  }
};

const configureTransactionTest = (categoryTests, block, blockHash) => {
  if (categoryTests.eth_getTransactionByBlockHashAndIndex) {
    categoryTests.eth_getTransactionByBlockHashAndIndex.params = [blockHash, '0x0'];
  }
  if (block.transactions?.length > 0) {
    const txHash = block.transactions[0].hash;
    if (categoryTests.eth_getTransactionByHash) {
      categoryTests.eth_getTransactionByHash.params = [txHash];
    }
    if (categoryTests.eth_getTransactionReceipt) {
      categoryTests.eth_getTransactionReceipt.params = [txHash];
    }
  }
};

const configureDebugTest = (categoryTests, block) => {
  if (categoryTests.debug_traceBlockByHash) {
    categoryTests.debug_traceBlockByHash.params = [block.hash, { tracer: "callTracer" }];
  }
  if (categoryTests.debug_traceBlockByNumber) {
    categoryTests.debug_traceBlockByNumber.params = [block.number, { tracer: "callTracer" }];
  }
  if (categoryTests.debug_storageRangeAt) {
    categoryTests.debug_storageRangeAt.params = [block.hash, 0, '0xACAE80Abf79994e555dfa70f66cBF573b05b9e3a', '0x0000000000000000000000000000000000000000000000000000000000000000', 1];
  }
  if (categoryTests.debug_traceTransaction && block.transactions?.[0]) {
    categoryTests.debug_traceTransaction.params = [block.transactions[0].hash, {tracer: 'callTracer'}];
  }
};

const configureUncleTest = (categoryTests, blockHash) => {
  if (categoryTests.eth_getUncleByBlockHashAndIndex) {
    categoryTests.eth_getUncleByBlockHashAndIndex.params = [blockHash, '0x0'];
  }
  if (categoryTests.eth_getUncleCountByBlockHash) {
    categoryTests.eth_getUncleCountByBlockHash.params = [blockHash];
  }
};

// ===== Filter Handling =====
const createFilter = async (endpoint, filterConfig) => {
  const filterResult = await executeTest(endpoint, 'eth_newFilter', filterConfig);
  
  if (!filterResult.result || typeof filterResult.result !== 'string') {
    return { filterResult, filterId: null };
  }
  
  const filterId = filterResult.result;
  console.log(`Filter created with ID: ${filterId}`);
  return { filterResult, filterId };
};

const executeFilterRelatedTests = async (endpoint, categoryTests, filterId) => {
  const filterTests = {
    eth_getFilterLogs: { ...categoryTests.eth_getFilterLogs, params: [filterId] },
    eth_getFilterChanges: { ...categoryTests.eth_getFilterChanges, params: [filterId] }
  };

  try {
    const results = await Promise.all(
      Object.entries(filterTests).map(([testName, testConfig]) => 
        executeTest(endpoint, testName, testConfig)
      )
    );

    // After all filter tests, uninstall the filter
    const uninstallResult = await executeTest(
      endpoint, 
      'eth_uninstallFilter', 
      { ...categoryTests.eth_uninstallFilter, params: [filterId] }
    );

    return [...results, uninstallResult];
  } catch (error) {
    // Ensure cleanup even if an error occurs
    try {
      await executeTest(
        endpoint, 
        'eth_uninstallFilter', 
        { ...categoryTests.eth_uninstallFilter, params: [filterId] }
      );
    } catch (cleanupError) {
      console.error('Failed to cleanup filter:', cleanupError);
    }
    throw error;
  }
};

const executeRemainingFilterTests = async (endpoint, categoryTests) => {
  const remainingTests = ['eth_newBlockFilter', 'eth_newPendingTransactionFilter', 'eth_getLogs'];
  
  return Promise.all(
    remainingTests
      .filter(testName => categoryTests[testName])
      .map(testName => executeTest(endpoint, testName, categoryTests[testName]))
  );
};

const executeFilterTests = async (endpoint, categoryTests, results) => {
  const { filterResult, filterId } = await createFilter(endpoint, categoryTests.eth_newFilter);
  results.push(filterResult);

  if (!filterId) {
    return { results, filterId: null };
  }

  const filterResults = await executeFilterRelatedTests(endpoint, categoryTests, filterId);
  results.push(...filterResults);

  const remainingResults = await executeRemainingFilterTests(endpoint, categoryTests);
  results.push(...remainingResults);

  return { results, filterId };
};

const cleanupFilter = async (endpoint, filterId) => {
  if (!filterId) return;
  
  try {
    await executeRpcCall(endpoint, 'eth_uninstallFilter', [filterId]);
    console.log(`Filter ${filterId} uninstalled`);
  } catch (error) {
    console.error(`Failed to uninstall filter ${filterId}:`, error);
  }
}; 