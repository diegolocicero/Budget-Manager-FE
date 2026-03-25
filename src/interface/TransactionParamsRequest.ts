import type { TransactionType } from "../constants";

export interface TransactionParams {
  page?: number;
  size?: number;
  type?: TransactionType | null;
  label?: string
}