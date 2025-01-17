# Chain RPC Tester

This project is designed to test various JSON-RPC methods for blockchain interactions. It includes a suite of tests to ensure the reliability and correctness of RPC calls.

## Setup Environment

1. **Clone the Repository**

   Clone this repository to your local machine using the following command:

   ```bash
   git clone https://github.com/HaoHaoLifeHack/chain-rpc-tester
   cd chain-rpc-tester
   ```

2. **Install Dependencies**

   Make sure you have Node.js installed. Then, install the necessary dependencies:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Copy the `.env.example` file to `.env` and fill in the necessary environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file to include your specific configuration, such as the RPC endpoint URL.

## Initialize

1. **Prepare Configuration**

   Ensure that the `src/config/rpc.test.config.js` file is properly configured with the RPC methods you wish to test. This file contains the test cases and their expected parameters.

2. **Check Constants**

   Verify that any constants required by your tests are correctly set in `src/config/constants.js`.

## Run

1. **Execute Tests**

   Run the test suite using the following command:

   ```bash
   npm start
   ```

   This will execute all the test categories defined in `src/tests/rpcTests.js` and log the results.

2. **View Results**

   Test results will be saved in `rpc_test_results.txt`. You can review this file to see detailed results of each test, including any errors or failures.

3. **Debugging**

   If you encounter issues, check the console output for error messages and ensure your environment variables and configurations are correct.

## Additional Information

- **Test Utilities**: The `src/tests/testUtils.js` file contains utility functions for formatting test results and saving them to a file.
- **RPC Client**: The `src/utils/rpcClient.js` module handles the creation and execution of JSON-RPC requests.
- **RLP Encoding**: The `src/utils/rlpEncoder.js` module provides functions for RLP encoding of blockchain data.

For further assistance, please refer to the comments within the code or contact the project owner.
