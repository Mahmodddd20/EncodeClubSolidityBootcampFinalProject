import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as piggyBankJson from '../assets/PiggyBank.json';
import { SubPiggyBank, Success } from './dtos/piggyBank.dto';

@Injectable()
export class AppService {
  provider: ethers.Provider;
  wallet: ethers.Wallet;
  piggyBankContract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      process.env.RPC_ENDPOINT_URL ?? '',
    );
    this.wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY ?? '',
      this.provider,
    );
    this.piggyBankContract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS ?? '',
      piggyBankJson.abi,
      this.wallet,
    );
  }

  async setAdmin(address: string): Promise<Success> {
    const tx = await this.piggyBankContract.setAdmin(address);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  }

  async createSubPiggyBank(
    subPiggyBankId: string,
    withdrawalTime: number,
  ): Promise<Success> {
    const tx = await this.piggyBankContract.createSubPiggyBank(
      subPiggyBankId,
      withdrawalTime,
    );
    await tx.wait();
    return { success: true, txHash: tx.hash };
  }

  async deposit(subPiggyBankId: string, amount: number): Promise<Success> {
    const tx = await this.piggyBankContract.deposit(subPiggyBankId, {
      value: ethers.parseEther(amount.toString()),
    });
    await tx.wait();
    return { success: true, txHash: tx.hash };
  }

  async withdraw(subPiggyBankId: string, amount: number): Promise<Success> {
    const tx = await this.piggyBankContract.withdraw(subPiggyBankId, amount);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  }

  async getSubPiggyBankData(subPiggyBankId: string): Promise<SubPiggyBank> {
    const data =
      await this.piggyBankContract.getSubPiggyBankData(subPiggyBankId);
    return {
      balance: ethers.formatEther(data[0]),
      withdrawalTime: data[1].toNumber(),
      owner: data[2],
    };
  }

  async getTotalBalance(): Promise<number> {
    const totalBalance = await this.piggyBankContract.getTotalBalance();
    return Number(ethers.formatEther(totalBalance));
  }

  async withdrawAllFromSubPiggy(subPiggyBankId: string): Promise<Success> {
    const tx =
      await this.piggyBankContract.withdrawAllFromSubPiggy(subPiggyBankId);
    await tx.wait();
    return { success: true, txHash: tx.hash };
  }

  async getAllSubPiggyBankIds(): Promise<string[]> {
    return this.piggyBankContract.getAllSubPiggyBankIds();
  }

  async getAllOwners(): Promise<string[]> {
    return this.piggyBankContract.getAllOwners();
  }

  async getSubPiggyBankDataForAddress(
    owner: string,
  ): Promise<[string[], number[], number[]]> {
    const data =
      await this.piggyBankContract.getSubPiggyBankDataForAddress(owner);
    const ids = data[0].map(ethers.decodeBytes32String);
    const balances = data[1].map((balance) =>
      Number(ethers.formatEther(balance)),
    );
    const withdrawalTimes = data[2].map((time) => time.toNumber());
    return [ids, balances, withdrawalTimes];
  }

  async withdrawBalance(): Promise<Success> {
    const contractBalance = await this.piggyBankContract.checkContractBalance();
    if (contractBalance.gt(0)) {
      const tx = await this.piggyBankContract.withdrawBalance();
      await tx.wait();
      return { success: true, txHash: tx.hash };
    }
  }

  async checkContractBalance(): Promise<number> {
    const contractBalance = await this.piggyBankContract.checkContractBalance();
    return Number(ethers.formatEther(contractBalance));
  }

  async withdrawFee(): Promise<Success> {
    const contractFeeBalance = await this.piggyBankContract.getFeeBalance();
    if (contractFeeBalance.gt(0)) {
      const tx = await this.piggyBankContract.withdrawFee();
      await tx.wait();
      return { success: true, txHash: tx.hash };
    }
  }

  async getFeeBalance(): Promise<number> {
    const contractFeeBalance = await this.piggyBankContract.getFeeBalance();
    return Number(ethers.formatEther(contractFeeBalance));
  }

  async emergencyWithdraw(subPiggyBankId: string): Promise<Success> {
    const subPiggy = await this.getSubPiggyBankData(subPiggyBankId);
    if (subPiggy.owner !== '0x0000000000000000000000000000000000000000') {
      const balanceToWithdraw = parseFloat(subPiggy.balance);
      const fee = (balanceToWithdraw * 5) / 100;
      const netAmount = balanceToWithdraw - fee;
      if (netAmount > 0) {
        const tx =
          await this.piggyBankContract.emergencyWithdraw(subPiggyBankId);
        await tx.wait();
        return { success: true, txHash: tx.hash };
      }
    }
  }
}
