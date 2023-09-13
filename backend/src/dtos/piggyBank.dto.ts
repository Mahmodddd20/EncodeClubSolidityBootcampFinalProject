export interface SubPiggyBank {
  balance: string;
  withdrawalTime: number;
  owner: string;
}

export interface Success {
  success: boolean;
  txHash: string;
}
