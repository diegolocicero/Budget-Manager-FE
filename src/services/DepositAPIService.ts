import { API_BASE_URL } from "../constants";
import type { Summary } from "../interface/ISummary";
import { apiFetch } from "./APIClient";

export interface DepositRequest {
  value: number;
  label: string;
}

export interface DepositResponse {
  id: number;
  value: number;
  label: string;
  createdAt: string;
}

export const DepositAPIService = {
  async getAll(): Promise<DepositResponse[]> {
    const res = await apiFetch("/deposits");
    if (!res.ok) throw new Error("Errore nel recupero delle entrate");
    return res.json();
  },

  async getById(id: number): Promise<DepositResponse> {
    const res = await apiFetch(`/deposits/${id}`);
    if (!res.ok) throw new Error(`Entrata con id ${id} non trovata`);
    return res.json();
  },

  async create(request: DepositRequest): Promise<DepositResponse> {
    const res = await apiFetch("/deposits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error("Errore nella creazione dell'entrata");
    return res.json();
  },

  async update(id: number, request: DepositRequest): Promise<DepositResponse> {
    const res = await apiFetch(`/deposits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) throw new Error(`Errore nell'aggiornamento dell'entrata con id ${id}`);
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await apiFetch(`/deposits/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Errore nella cancellazione dell'entrata con id ${id}`);
  },

  // Calcola il summary aggregando getAll deposits + withdrawals
  async getSummary(): Promise<Summary> {
    const res = await apiFetch("/deposits");
    if (!res.ok) throw new Error("Errore nel recupero del riepilogo entrate");
    const deposits: DepositResponse[] = await res.json();
    const totEntrate = deposits.reduce((acc, d) => acc + d.value, 0);
    return { totEntrate, totUscite: 0 };
  },

  // Aggiunge una entrata — wrapper usato dalla Home
  async addDeposit(label: string, value: number): Promise<DepositResponse> {
    return DepositAPIService.create({ label, value });
  },
};