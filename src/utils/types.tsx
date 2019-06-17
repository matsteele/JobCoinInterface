export interface Transactions {
  timestamp: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  sumForUser: number;
}

export interface State {
  transactions: Transactions[];
  currentUserTransactions: Transactions[];
  allUsers: string[];
  currentUser: string;
}

export interface Scales {
  xTimeScale(realInput: number): number;
  yTransScale(realInput: number): number;
}
