import { ADDRESSES, STORAGE } from './constants.js';

export const rpcTests = {
  // 1. Getting Blocks
  blockTests: {
    eth_blockNumber: {
      method: 'eth_blockNumber',
      params: [],
      validator: (result) => typeof result === 'string' && result.startsWith('0x')
    },
    eth_getBlockByNumber: {
      method: 'eth_getBlockByNumber',
      params: ['latest', true],
      validator: (result) => result && typeof result === 'object' && result.hash
    },
    eth_getBlockByHash: {
      method: 'eth_getBlockByHash',
      params: [], // Dynamically set
      validator: (result) => result && typeof result === 'object' && result.hash
    },
    eth_getBlockTransactionCountByNumber: {
      method: 'eth_getBlockTransactionCountByNumber',
      params: ['latest'],
      validator: (result) => typeof result === 'string' && result.startsWith('0x')
    },
    eth_getBlockTransactionCountByHash: {
      method: 'eth_getBlockTransactionCountByHash',
      params: [], // Dynamically set
      validator: (result) => typeof result === 'string' && result.startsWith('0x')
    },
    eth_getBlockReceipts: {
      method: 'eth_getBlockReceipts',
      params: ['latest'],
      validator: (result) => Array.isArray(result)
    }
  },

  // 2. Reading Transactions
  transactionTests: {
    eth_getTransactionByBlockHashAndIndex: {
      method: 'eth_getTransactionByBlockHashAndIndex',
      params: [],
      validator: (result) => result && typeof result === 'object' && result.hash
    },
    eth_getTransactionByBlockNumberAndIndex: {
      method: 'eth_getTransactionByBlockNumberAndIndex',
      params: ['latest', '0x0'],
      validator: (result) => result && typeof result === 'object' && result.hash
    },
    eth_getTransactionCount: {
      method: 'eth_getTransactionCount',
      params: [ADDRESSES.ACCOUNTS.TEST_ACCOUNT, 'latest'],
      validator: (result) => typeof result === 'string' && result.startsWith('0x')
    },
    eth_getTransactionByHash: {
      method: 'eth_getTransactionByHash',
      params: [],
      validator: (result) => result && typeof result === 'object' && result.hash
    },
    eth_getTransactionReceipt: {
      method: 'eth_getTransactionReceipt',
      params: [],
      validator: (result) => result && typeof result === 'object' && result.transactionHash
    }
  },

  // 3. Writing Transactions & EVM Execution
  evmTests: {
    eth_call: {
      method: 'eth_call',
      params: [{
          to: ADDRESSES.CONTRACTS.TOKEN,  // Contract Address
          data: '0x70a08231000000000000000000000000742d35Cc6634C0532925a3b844Bc454e4438f44e' // balanceOf 
          }, 'latest'],

      validator: (result) => typeof result === 'string' && result.startsWith('0x')
    }
  },

  // 4. Account Information
  accountTests: {
    eth_getBalance: {
      method: 'eth_getBalance',
      params: [ADDRESSES.ACCOUNTS.TEST_ACCOUNT, 'latest'],
      validator: (result) => typeof result === 'string' && result.startsWith('0x')
    },
    eth_accounts: {
      method: 'eth_accounts',
      params: [],
      validator: (result) => Array.isArray(result) && 
        result.every(addr => typeof addr === 'string' && addr.startsWith('0x'))
    },
    eth_getProof: {
      method: 'eth_getProof',
      params: [
        ADDRESSES.ACCOUNTS.TEST_ACCOUNT,
        [STORAGE.SLOTS.ZERO],
        'latest'
      ],
      validator: (result) => result && 
        result.accountProof && 
        result.storageProof &&
        Array.isArray(result.accountProof)
    },
    eth_getCode: {
      method: 'eth_getCode',
      params: [ADDRESSES.CONTRACTS.TOKEN, 'latest'],
      validator: (result) => typeof result === 'string' && result.startsWith('0x')
    },
    eth_getStorageAt: {
      method: 'eth_getStorageAt',
      params: [
        ADDRESSES.CONTRACTS.TOKEN,
        STORAGE.SLOTS.ZERO,
        'latest'
      ],
      validator: (result) => typeof result === 'string' && result.startsWith('0x')
    }
  },

  // 5. Event Logs
  eventTests: {
    eth_getLogs: {
      method: 'eth_getLogs',
      params: [{
        fromBlock: '0x68fd4',
        toBlock: 'latest',
        address: ADDRESSES.CONTRACTS.TOKEN,
        topics: []
      }],
      validator: (result) => Array.isArray(result)
    },

    eth_newFilter: {
      method: 'eth_newFilter',
      params: [{
        fromBlock: '0x68fd4',
        toBlock: 'latest',
        address: ADDRESSES.CONTRACTS.TOKEN
      }],
      validator: (result) => typeof result === 'string' && result.startsWith('0x')
    },

    eth_getFilterLogs: {
      method: 'eth_getFilterLogs',
        params: [], // Dynamically set 
      validator: (result) => Array.isArray(result)
    },

    eth_getFilterChanges: {
      method: 'eth_getFilterChanges',
      params: [], // Dynamically set
      validator: (result) => Array.isArray(result)
    },

    eth_uninstallFilter: {
      method: 'eth_uninstallFilter',
      params: [], // Dynamically set
      validator: (result) => typeof result === 'boolean'
    },

    eth_newBlockFilter: {
      method: 'eth_newBlockFilter',
      params: [],
      validator: (result) => typeof result === 'string' && result.startsWith('0x')
    },

    eth_newPendingTransactionFilter: {
      method: 'eth_newPendingTransactionFilter',
      params: [],
      validator: (result) => typeof result === 'string' && result.startsWith('0x')
    }
  },

  // 6. Chain Information
  chainTests: {
    eth_chainId: {
      method: 'eth_chainId',
      params: [],
      validator: (result) => typeof result === 'string' && result.startsWith('0x'),
      errorReason: 'Invalid chain ID format'
    },
    net_listening: {
      method: 'net_listening',
      params: [],
      validator: (result) => typeof result === 'boolean',
      errorReason: 'Invalid network listening status'
    },
    eth_syncing: {
      method: 'eth_syncing',
      params: [],
      validator: (result) => {
        // syncing 可能返回 false 或者一個同步狀態對象
        return typeof result === 'boolean' || 
          (typeof result === 'object' && 
           result !== null && 
           'currentBlock' in result && 
           'highestBlock' in result);
      },
      errorReason: 'Invalid syncing status format'
    },
    net_version: {
      method: 'net_version',
      params: [],
      validator: (result) => typeof result === 'string' && /^\d+$/.test(result),
      errorReason: 'Invalid network version format'
    }
  },

  // 7. Getting Uncles
  uncleTests: {
    eth_getUncleByBlockHashAndIndex: {
      method: 'eth_getUncleByBlockHashAndIndex',
      params: [],
      validator: (result) => {
        // Uncle block 可能不存在（返回 null）或者是一個區塊物件
        return result === null || 
          (typeof result === 'object' && 
           result !== null && 
           'hash' in result);
      },
      errorReason: 'Invalid uncle block format'
    },
    eth_getUncleByBlockNumberAndIndex: {
      method: 'eth_getUncleByBlockNumberAndIndex',
      params: ['latest', '0x0'],
      validator: (result) => {
        return result === null || 
          (typeof result === 'object' && 
           result !== null && 
           'hash' in result);
      },
      errorReason: 'Invalid uncle block format'
    },
    eth_getUncleCountByBlockHash: {
      method: 'eth_getUncleCountByBlockHash',
      params: [],
      validator: (result) => typeof result === 'string' && result.startsWith('0x'),
      errorReason: 'Invalid uncle count format'
    },
    eth_getUncleCountByBlockNumber: {
      method: 'eth_getUncleCountByBlockNumber',
      params: ['latest'],
      validator: (result) => typeof result === 'string' && result.startsWith('0x'),
      errorReason: 'Invalid uncle count format'
    }
  },

  // 8. Gas Estimation
  gasTests: {
    eth_estimateGas: {
      method: 'eth_estimateGas',
      params: [{
        to: ADDRESSES.CONTRACTS.TOKEN,
        data: '0x70a08231000000000000000000000000742d35Cc6634C0532925a3b844Bc454e4438f44e', // balanceOf
        value: '0x0' // 0 ETH
      }],
      validator: (result) => typeof result === 'string' && result.startsWith('0x'),
      errorReason: 'Invalid gas estimation format'
    },

    eth_gasPrice: {
      method: 'eth_gasPrice',
      params: [],
      validator: (result) => typeof result === 'string' && result.startsWith('0x'),
      errorReason: 'Invalid gas price format'
    },

    eth_feeHistory: {
      method: 'eth_feeHistory',
      params: [
        '0x4', // 要獲取的最近區塊數量
        'latest',
        [25, 50, 75] // 百分位數數組
      ],
      validator: (result) => {
        return result && 
          Array.isArray(result.baseFeePerGas) && 
          Array.isArray(result.gasUsedRatio) && 
          Array.isArray(result.reward);
      },
      errorReason: 'Invalid fee history format'
    },

    eth_maxPriorityFeePerGas: {
      method: 'eth_maxPriorityFeePerGas',
      params: [],
      validator: (result) => typeof result === 'string' && result.startsWith('0x'),
      errorReason: 'Invalid max priority fee format'
    },
  },

  // 10. Transaction Pool
  txpoolTests: {
    txpool_content: {
      method: 'txpool_content',
      params: [],
      validator: (result) => {
        return result && 
          typeof result === 'object' &&
          'pending' in result &&
          'queued' in result;
      },
      errorReason: 'Invalid txpool content format'
    },

    txpool_inspect: {
      method: 'txpool_inspect',
      params: [],
      validator: (result) => {
        return result && 
          typeof result === 'object' &&
          'pending' in result &&
          'queued' in result;
      },
      errorReason: 'Invalid txpool inspection format'
    },

    txpool_contentFrom: {
      method: 'txpool_contentFrom',
      params: ['0x3470bF351B929F4D3dB2a397DE7Ca980A70Cfbb9'],
      validator: (result) => {
        return result && 
          typeof result === 'object' &&
          'pending' in result &&
          'queued' in result;
      },
      errorReason: 'Invalid txpool content from address format'
    },

    txpool_status: {
      method: 'txpool_status',
      params: [],
      validator: (result) => {
        return result && 
          typeof result === 'object' &&
          'pending' in result &&
          'queued' in result &&
          result.pending.startsWith('0x') &&
          result.queued.startsWith('0x');
      },
      errorReason: 'Invalid txpool status format'
    }
  },

  // 11. Web3
  web3Tests: {
    web3_clientVersion: {
      method: 'web3_clientVersion',
      params: [],
      validator: (result) => typeof result === 'string' && result.length > 0,
      errorReason: 'Invalid client version format'
    },

    web3_sha3: {
      method: 'web3_sha3',
      params: ['0x68656c6c6f20776f726c64'], // "hello world" in hex
      validator: (result) => {
        return typeof result === 'string' && 
          result.startsWith('0x') && 
          result.length === 66; // 0x + 64 characters (32 bytes)
      },
      errorReason: 'Invalid SHA3 hash format'
    }
  },

  // 12. Debug API
  debugTests: {
    debug_getBadBlocks: {
      method: 'debug_getBadBlocks',
      params: [],
      validator: (result) => Array.isArray(result),
      errorReason: 'Invalid bad blocks format'
    },

    debug_storageRangeAt: {
      method: 'debug_storageRangeAt',
      params: [
        '0x0', // blockHash
        0,    // txIndex
        ADDRESSES.CONTRACTS.TOKEN, // contract address
        STORAGE.SLOTS.ZERO, // start key
        1     // max result
      ],
      validator: (result) => {
        return result && 
          'storage' in result &&
          'nextKey' in result;
      },
      errorReason: 'Invalid storage range format'
    },

    debug_traceBlock: {
      method: 'debug_traceBlock',
      params: [
        "0xf90344f90240a09378f91dd3c278c52ff11c5cf8ad939047796e8c8151d06f3e537acdc77e0564a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347944200000000000000000000000000000000000011a050a39972908a351ecdeee2cec91752234b46e04c47d3acaf413db1534744a089a017b93ab47908f8b2d1f985f198c67fb2970b8f9236b6a6c7691f409d23e35f09a09a184f2b5e6cd1bfe09b37f6db09e77331fb2688166b45197748ffbff06aa3f3b90100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008083592b918401c9c38082ab42846788ce7680a02982c3dbc9198a396a2c4836e41a6abb16b0f1351627798039e72c4963b70f8488000000000000000081fca056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b4218080a0e4d99b300aa880a26d897f82ebff610e5e07f0c46932fb8dac77ffb9699252d0f8fdb8fb7ef8f8a067a620a482b90f1141263eada469413a57281b04f148cdede1713ca3f02e105194deaddeaddeaddeaddeaddeaddeaddeaddead00019442000000000000000000000000000000000000158080830f424080b8a4440a5e2000000558000c5fc50000000000000004000000006788ce380000000000727cd1000000000000000000000000000000000000000000000000000000027293d54d000000000000000000000000000000000000000000000000000000000000000117d78551e9b4b9a3ca4bbeefb35200861c58352d390090a09e58e2801cbade4f0000000000000000000000001adc7b6c9bd1643287638d016d415c39920f6b01c0c0",
        {
          "tracer": "callTracer"
        }
      ],
      validator: (result) => Array.isArray(result) &&
        result.every(trace => 
          trace.result &&
          trace.result.calls &&
          Array.isArray(trace.result.calls) &&
          trace.result.from &&
          trace.result.gas &&
          trace.result.gasUsed &&
          trace.txHash
        ),
      errorReason: 'Invalid block trace format'
    },

    debug_traceBlockByHash: {
      method: 'debug_traceBlockByHash',
      params: [],  // Dynamically set
      validator: (result) => Array.isArray(result) &&
        result.every(trace => 
          trace.result && 
          typeof trace.result.gasUsed === 'string'
        ),
      errorReason: 'Invalid block trace format'
    },

    debug_traceBlockByNumber: {
      method: 'debug_traceBlockByNumber',
      params: [],  // Dynamically set
      validator: (result) => Array.isArray(result) &&
        result.every(trace => 
          trace.result && 
          typeof trace.result.gasUsed === 'string'
        ),
      errorReason: 'Invalid block trace format'
    },

    debug_traceCall: {
      method: 'debug_traceCall',
      params: [
        {
          to: ADDRESSES.CONTRACTS.TOKEN,
          data: '0x70a08231000000000000000000000000742d35Cc6634C0532925a3b844Bc454e4438f44e' // balanceOf
        },
        'latest',
        {
          tracer: 'callTracer'
        }
      ],
      validator: (result) => {
        return result && 
          typeof result === 'object' &&
          'type' in result &&
          'from' in result &&
          'to' in result;
      },
      errorReason: 'Invalid call trace format'
    },

    debug_traceTransaction: {
      method: 'debug_traceTransaction',
      params: [''],
      validator: (result) => {
        return result && 
          typeof result === 'object' &&
          'calls' in result &&
          Array.isArray(result.calls);
      },
      errorReason: 'Invalid transaction trace format'
    }
  },
}; 