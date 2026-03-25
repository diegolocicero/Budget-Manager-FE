import type { TransactionResponseWithType } from "./TransactionResponse";

export interface TransactionPage {
  content: TransactionResponseWithType[];
  totalElements: number;
  totalPages: number;
  number: number;   
  size: number;
  last: boolean;
}