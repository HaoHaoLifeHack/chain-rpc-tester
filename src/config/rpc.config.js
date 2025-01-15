export const rpcEndpoints = {
  ethereum: {
    mainnet: {
      infura: process.env.ETH_MAINNET_INFURA || 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
      alchemy: process.env.ETH_MAINNET_ALCHEMY || 'https://eth-mainnet.alchemyapi.io/v2/YOUR-API-KEY'
    },
    testnet: {
      goerli: process.env.ETH_GOERLI || 'https://goerli.infura.io/v3/YOUR-PROJECT-ID',
      sepolia: process.env.ETH_SEPOLIA || 'https://sepolia.infura.io/v3/YOUR-PROJECT-ID'
    }
  },
  binance: {
    mainnet: process.env.BSC_MAINNET || 'https://bsc-dataseed.binance.org/',
    testnet: process.env.BSC_TESTNET || 'https://data-seed-prebsc-1-s1.binance.org:8545/'
  },
  polygon: {
    mainnet: process.env.POLYGON_MAINNET || 'https://polygon-rpc.com',
    testnet: process.env.POLYGON_MUMBAI || 'https://rpc-mumbai.maticvigil.com'
  }
} 