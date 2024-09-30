require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.26",
  paths: {
    sources: "./blockchain/contracts",
    tests: "./tests",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    vechain: {
      url: process.env.THOR_URL || "http://localhost:8669",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 39 // VeChain Thor chainId
    }
  }
};
