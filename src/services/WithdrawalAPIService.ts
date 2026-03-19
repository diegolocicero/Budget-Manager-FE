import { API_BASE_URL } from "../constants";
import { apiFetch } from "./APIClient";

export interface WithdrawalRequest {
  value: number;
  label: string;
}

export interface WithdrawalResponse {
  id: number;
  value: number;
  label: string;
  createdAt: string;
}

export const WithdrawalAPIService = {
  async getAll(): Promise<WithdrawalResponse[]> {
    const res = await apiFetch("/withdrawals");
    if (!res.ok) throw new Error("Errore nel recupero delle uscite");
    return res.json();
  },

  async getById(id: number): Promise<WithdrawalResponse> {
    const res = await apiFetch(`/withdrawals/${id}`);
    if (!res.ok) throw new Error(`Uscita con id ${id} non trovata`);
    return res.json();
  },

  async create(request: WithdrawalRequest): Promise<WithdrawalResponse> {
    const res = await apiFetch("/withdrawals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error("Errore nella creazione dell'uscita");
    return res.json();
  },

  async update(
    id: number,
    request: WithdrawalRequest,
  ): Promise<WithdrawalResponse> {
    const res = await apiFetch(`/withdrawals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok)
      throw new Error(`Errore nell'aggiornamento dell'uscita con id ${id}`);
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await apiFetch(`/withdrawals/${id}`, {
      method: "DELETE",
    });
    if (!res.ok)
      throw new Error(`Errore nella cancellazione dell'uscita con id ${id}`);
  },

  // Wrapper usato dalla Home
  async addWithdrawal(
    label: string,
    value: number,
  ): Promise<WithdrawalResponse> {
    return WithdrawalAPIService.create({ label, value });
  },

  // Get last 5 withdrawals
  async getRecent(limit: number = 5): Promise<WithdrawalResponse[]> {
    const res = await apiFetch(`/withdrawals/recent?limit=${limit}`);
    if (!res.ok) throw new Error("Errore nel recupero delle ultime uscite");
    return res.json();
  },
};
