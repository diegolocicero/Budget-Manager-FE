import type { Summary } from "../interface/ISummary";

const BASE_URL = "/api/example";
 
export interface DepositPayload {
  description: string;
  amount: number;
  date: string;
}
 
export const DepositAPIService = {
  async getSummary(): Promise<Summary> {
    const res = await fetch(`${BASE_URL}/summary`);
    if (!res.ok) throw new Error("Errore nel recupero del riepilogo");
    return res.json();
  },
 
  async addDeposit(description: string, amount: number): Promise<void> {
    const payload: DepositPayload = {
      description,
      amount,
      date: new Date().toISOString(),
    };
    const res = await fetch(`${BASE_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "entrata", ...payload }),
    });
    if (!res.ok) throw new Error("Errore nell'aggiunta dell'entrata");
  },
};