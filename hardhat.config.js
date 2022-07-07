require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

const MATIC_KEY = process.env.MATIC_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: "1000000000000000000000000000000000000000",
      },
    },
    fork: {
      url: "http://127.0.0.1:8545/",
    },

    matic: {
      url: process.env.MUMBAI_RPC_URL,
      accounts: [`0x${MATIC_KEY}`],
      chainId: 80001,
      gas: 30000000,
      gasPrice: 690000000000,
    },

    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [`0x${MATIC_KEY}`],
      chainId: 4,
    },

    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [`0x${MATIC_KEY}`],
      chainId: 5,
    },
  },
  etherscan: {
    apiKey: process.env.MATIC_API_KEY, //for polygonscan (mumbai)
  },
};
