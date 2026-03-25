import type { TransactionPage } from "../interface/TransactionPage";
import type { TransactionParams } from "../interface/TransactionParamsRequest";
import { apiFetch } from "./APIClient";

export const TransactionAPIService = {
  async getAll(params: TransactionParams = {}): Promise<TransactionPage> {
    const { page = 0, size = 20, type = null, label = "" } = params;

    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    });

    if (type) query.append("type", type);
    
    // Aggiungiamo la label alla query string solo se non è vuota
    if (label && label.trim() !== "") {
      query.append("label", label);
    }

    const res = await apiFetch(`/transactions?${query.toString()}`);
    
    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Errore BE:", res.status, errorBody);
      throw new Error("Errore nel recupero delle transazioni");
    }
    
    return res.json();
  },
};