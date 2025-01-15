import { testBlockNumber } from './tests/rpcTests.js';
import { logger } from './utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const main = async () => {
  const endpoint = process.env.GUDCHAIN_DEV;
  
  if (!endpoint) {
    logger.error('No RPC endpoint provided in .env file');
    process.exit(1);
  }

  try {
    await testBlockNumber(endpoint);
  } catch (error) {
    logger.error('Application error:', error);
    process.exit(1);
  }
};

main(); 