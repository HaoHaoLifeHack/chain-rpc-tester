import fs from 'fs/promises';
import { executeRpcCall } from '../utils/rpc.utils.js';

// Format test result
export const formatTestResult = (testName, result, isValid, errorReason = null) => ({
  timestamp: new Date().toISOString(),
  method: testName,
  result: result,
  isValid: isValid,
  details: isValid 
    ? `Test passed successfully` 
    : errorReason || 'Test failed'
});

// Save results to file
export const saveToFile = async (data) => {
  const content = JSON.stringify(data, null, 2);
  
  if (!saveToFile.initialized) {
    await fs.writeFile('rpc_test_results.txt', '');
    saveToFile.initialized = true;
  }
  
  await fs.appendFile('rpc_test_results.txt', content + '\n\n');
};

// Execute a single test
export const executeTest = async (endpoint, testName, testConfig) => {
  try {
    const result = await executeRpcCall(endpoint, testConfig.method, testConfig.params);
    const isValid = testConfig.validator(result);
    const testResult = formatTestResult(
      testName, 
      result,
      isValid,
      !isValid ? testConfig.errorReason : null
    );

    console.log(`${testName}: ${isValid ? '✅ PASSED' : '❌ FAILED'}`);
    await saveToFile(testResult);

    return { testName, result, isValid };

  } catch (error) {
    console.log(`${testName}: ❌ FAILED (Error)`);
    
    const errorResponse = error.response?.data || {
      error: error.message,
      code: error.code,
      details: error.details
    };

    const testResult = formatTestResult(
      testName,
      errorResponse,
      false,
      `Exception: ${error.message}`
    );
    
    await saveToFile(testResult);
    return { 
      testName, 
      result: errorResponse,
      error: error.message, 
      isValid: false 
    };
  }
}; 