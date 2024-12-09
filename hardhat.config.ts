import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "hardhat-deploy";
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const config: HardhatUserConfig = {
  w3f: {
    rootDir: "./frontend/src",
    debug: false,
    networks: ["hardhat", "sepolia"],
  },
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/006a677fe90346f9bf6cb52a2a6b340b",
      accounts: [PRIVATE_KEY],
    },
    hardhat: {
      chainId: 31337,
    },
    zkEVM: {
      url: "https://rpc.cardona.zkevm-rpc.com",
      accounts: [PRIVATE_KEY],
    },
    scrollSepolia: {
      url: "https://sepolia-rpc.scroll.io/",
      accounts: [PRIVATE_KEY],
    },
    BNB_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: [PRIVATE_KEY],
    },
    ArbitrumBlueberry: {
      url: "https://rpc.arb-blueberry.gelato.digital",
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
