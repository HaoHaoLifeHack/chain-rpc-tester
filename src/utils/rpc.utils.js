import axios from 'axios';
import { pipe, prop, tryCatch, always } from 'ramda';
import { logger } from './logger.js';

// Create JSON-RPC request payload
const createJsonRpcPayload = (method, params = []) => ({
  jsonrpc: '2.0',
  id: Date.now(),
  method,
  params
});

// Make RPC call
const makeRpcCall = async (endpoint, payload) => {
  try {
    const response = await axios.post(endpoint, payload);
    return response.data;
  } catch (error) {
    logger.error(`RPC call failed: ${error.message}`);
    throw error;
  }
};

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