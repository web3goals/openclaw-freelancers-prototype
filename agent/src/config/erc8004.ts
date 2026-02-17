import { bsc, sepolia } from "viem/chains";
import { Erc8004Config } from "../types/config";

// @ts-ignore
const erc8004ConfigTestnet: Erc8004Config = {
  chain: sepolia,
  explorer: "https://testnet.8004scan.io/agents/sepolia",
};

const erc8004ConfigMainnet: Erc8004Config = {
  chain: bsc,
  explorer: "https://www.8004scan.io/agents/bsc",
};

export const erc8004Config = erc8004ConfigMainnet;
