import { runAllTests } from './tests/rpcTests.js';
import dotenv from 'dotenv';

dotenv.config();

const main = async () => {
  const endpoint = process.env.ENDPOINT_URL;
  
  if (!endpoint) {
    console.error('No RPC endpoint provided in .env file');
    process.exit(1);
  }

  try {
    await runAllTests(endpoint);
  } catch (error) {
    console.error('Application error:', error);
    process.exit(1);
  }
};

main(); 