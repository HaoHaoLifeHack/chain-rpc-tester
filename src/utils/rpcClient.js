import axios from 'axios';
import { logger } from './logger.js';

// Create JSON-RPC request payload
export const createJsonRpcPayload = (method, params = []) => ({
  jsonrpc: '2.0',
  id: Date.now(),
  method,
  params
});

// Make RPC call
export const makeRpcCall = async (endpoint, payload) => {
  try {
    const response = await axios.post(endpoint, payload);
    return response.data;
  } catch (error) {
    logger.error(`RPC call failed: ${error.message}`);
    throw error;
  }
}; 