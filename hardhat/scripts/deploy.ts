import * as dotenv from "dotenv";
import { ethers } from "ethers";

import { PiggyBank__factory } from "../typechain-types";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  console.log(`Using address ${wallet.address}`);
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  const piggyBankFactory = new PiggyBank__factory(wallet);
  const piggyBankContract = await piggyBankFactory.deploy();
  await piggyBankContract.waitForDeployment();

  const address = await piggyBankContract.getAddress();
  console.log(`Contract deployed at address ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});