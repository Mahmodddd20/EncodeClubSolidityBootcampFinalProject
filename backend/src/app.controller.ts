import { Controller, Get, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { SubPiggyBank, Success } from './dtos/piggyBank.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('setAdmin/:address')
  async setAdmin(@Param('address') address: string): Promise<Success> {
    const result = await this.appService.setAdmin(address);
    return result;
  }

  @Post('createSubPiggyBank/:subPiggyBankId/:withdrawalTime')
  async createSubPiggyBank(
    @Param('subPiggyBankId') subPiggyBankId: string,
    @Param('withdrawalTime') withdrawalTime: number,
  ): Promise<Success> {
    const result = await this.appService.createSubPiggyBank(
      subPiggyBankId,
      withdrawalTime,
    );
    return result;
  }

  @Post('deposit/:subPiggyBankId/:amount')
  async deposit(
    @Param('subPiggyBankId') subPiggyBankId: string,
    @Param('amount') amount: number,
  ): Promise<Success> {
    const result = await this.appService.deposit(subPiggyBankId, amount);
    return result;
  }

  @Post('withdraw/:subPiggyBankId/:amount')
  async withdraw(
    @Param('subPiggyBankId') subPiggyBankId: string,
    @Param('amount') amount: number,
  ): Promise<Success> {
    const result = await this.appService.withdraw(subPiggyBankId, amount);
    return result;
  }

  @Get('getSubPiggyBankData/:subPiggyBankId')
  async getSubPiggyBankData(
    @Param('subPiggyBankId') subPiggyBankId: string,
  ): Promise<SubPiggyBank> {
    const result = await this.appService.getSubPiggyBankData(subPiggyBankId);
    return result;
  }

  @Get('getTotalBalance')
  async getTotalBalance(): Promise<number> {
    const result = await this.appService.getTotalBalance();
    return result;
  }

  @Post('withdrawAllFromSubPiggy/:subPiggyBankId')
  async withdrawAllFromSubPiggy(
    @Param('subPiggyBankId') subPiggyBankId: string,
  ): Promise<Success> {
    const result =
      await this.appService.withdrawAllFromSubPiggy(subPiggyBankId);
    return result;
  }

  @Get('getAllSubPiggyBankIds')
  async getAllSubPiggyBankIds(): Promise<string[]> {
    const result = await this.appService.getAllSubPiggyBankIds();
    return result;
  }

  @Get('getAllOwners')
  async getAllOwners(): Promise<string[]> {
    const result = await this.appService.getAllOwners();
    return result;
  }

  @Get('getSubPiggyBankDataForAddress/:owner')
  async getSubPiggyBankDataForAddress(
    @Param('owner') owner: string,
  ): Promise<[string[], number[], number[]]> {
    const result = await this.appService.getSubPiggyBankDataForAddress(owner);
    return result;
  }

  @Post('withdrawBalance')
  async withdrawBalance(): Promise<Success> {
    const result = await this.appService.withdrawBalance();
    return result;
  }

  @Get('checkContractBalance')
  async checkContractBalance(): Promise<number> {
    const result = await this.appService.checkContractBalance();
    return result;
  }

  @Post('withdrawFee')
  async withdrawFee(): Promise<Success> {
    const result = await this.appService.withdrawFee();
    return result;
  }

  @Get('getFeeBalance')
  async getFeeBalance(): Promise<number> {
    const result = await this.appService.getFeeBalance();
    return result;
  }

  @Post('emergencyWithdraw/:subPiggyBankId')
  async emergencyWithdraw(
    @Param('subPiggyBankId') subPiggyBankId: string,
  ): Promise<Success> {
    const result = await this.appService.emergencyWithdraw(subPiggyBankId);
    return result;
  }
}
