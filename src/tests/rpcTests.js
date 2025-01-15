import { executeRpcCall } from '../utils/rpc.utils.js';
import fs from 'fs/promises';

// Validate block number
const validateBlockNumber = (result) => {
  const isValidHex = typeof result === 'string' && result.startsWith('0x');
  const number = isValidHex ? parseInt(result, 16) : 0;
  return isValidHex && number > 0;
};

// Format test result
const formatTestResult = (result, isValid) => ({
  timestamp: new Date().toISOString(),
  method: 'eth_blockNumber',
  result: result,
  isValid: isValid,
  details: isValid 
    ? `Block number: ${parseInt(result, 16)}` 
    : 'Invalid block number format'
});

// Function to save results to file
const saveToFile = async (data) => {
  const content = JSON.stringify(data, null, 2);
  await fs.appendFile('rpc_test_results.txt', content + '\n\n');
};

// Main test function
export const testBlockNumber = async (endpoint) => {
  try {
    // 1. Get the block number
    const result = await executeRpcCall(endpoint, 'eth_blockNumber', []);
    console.log('Raw result:', result);

    // 2. Validate the result
    const isValid = validateBlockNumber(result);

    // 3. Format the result
    const testResult = formatTestResult(result, isValid);

    // 4. Output the result
    if (isValid) {
      console.log('eth_blockNumber: ✅ PASSED');
    } else {
      console.log('eth_blockNumber: ❌ FAILED');
    }

    // 5. Save the result
    await saveToFile(testResult);
    
    return testResult;

  } catch (error) {
    const errorResult = {
      timestamp: new Date().toISOString(),
      method: 'eth_blockNumber',
      error: error.message,
      isValid: false
    };
    
    console.log('eth_blockNumber: ❌ FAILED (Error)');
    console.log(errorResult);
    await saveToFile(errorResult);
    return errorResult;
  }
}; 