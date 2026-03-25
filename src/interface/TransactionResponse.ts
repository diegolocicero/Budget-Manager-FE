export interface TransactionResponse {
  id: number;
  value: number;
  label: string;
  createdAt: string;
}

export interface TransactionResponseWithType extends TransactionResponse {
  type: "DEPOSIT" | "WITHDRAWAL";
}