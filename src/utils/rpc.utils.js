import axios from 'axios';
import { logger } from './logger.js';
import { createJsonRpcPayload, makeRpcCall } from './rpcClient.js';

// Compose RPC request and handle response
export const executeRpcCall = async (endpoint, method, params) => {
  try {
    const payload = createJsonRpcPayload(method, params);
    const response = await makeRpcCall(endpoint, payload);
    return response.result;
  } catch (error) {
    logger.error(`Failed to execute RPC call: ${error.message}`);
    return null;
  }
}; 