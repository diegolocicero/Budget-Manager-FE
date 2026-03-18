const BASE_URL = "/api/example";

export interface WithdrawalPayload {
  description: string;
  amount: number;
  date: string;
}

export const WithdrawalAPIService = {
  async addWithdrawal(description: string, amount: number): Promise<void> {
    const payload: WithdrawalPayload = {
      description,
      amount,
      date: new Date().toISOString(),
    };
    const res = await fetch(`${BASE_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "uscita", ...payload }),
    });
    if (!res.ok) throw new Error("Errore nell'aggiunta dell'uscita");
  },
};