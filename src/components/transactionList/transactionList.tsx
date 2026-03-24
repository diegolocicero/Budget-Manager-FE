import { useState } from "react";
import "./transactionList.css";
import TransactionModal from "../transactionModal/transactionModal";

interface Transaction {
  id: number;
  label: string;
  value: number;
  createdAt: string;
}

interface Props {
  type: "entrata" | "uscita";
  transactions: Transaction[]; // Usiamo direttamente queste
  onRefresh: () => void;
  loading: boolean;
}

const fmt = (n: number) =>
  n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });

export default function TransactionList({ type, transactions, onRefresh, loading }: Props) {
  const isEntrata = type === "entrata";
  const [selected, setSelected] = useState<Transaction | null>(null);

  return (
    <>
      <div className="transactions-card">
        <div className="transactions-header">
          <span className={`transactions-icon ${isEntrata ? "transactions-icon-entrate" : "transactions-icon-uscite"}`}>
            {isEntrata ? "↑" : "↓"}
          </span>
          <h3 className="transactions-title">
            {isEntrata ? "Ultime Entrate" : "Ultime Uscite"}
          </h3>
        </div>
        
        <ul className="transactions-list">
          {/* LOGICA DI PRIORITÀ CORRETTA */}
          {loading ? (
            // 1. Se sta caricando (loading === true), mostra SEMPRE lo skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="transaction-item skeleton-item">
                <div className="skeleton skeleton-dot" />
                <div className="transaction-info">
                  <div className="skeleton skeleton-label" />
                  <div className="skeleton skeleton-date" />
                </div>
                <div className="skeleton skeleton-amount-list" />
              </li>
            ))
          ) : transactions.length === 0 ? (
            // 2. Se ha finito di caricare (loading === false) MA l'array è vuoto
            <li className="transaction-empty">Nessun movimento recente</li>
          ) : (
            // 3. Se ha finito di caricare e ci sono dati
            transactions.map((item) => (
              <li
                key={item.id}
                className="transaction-item transaction-item--clickable"
                onClick={() => setSelected(item)}
              >
                <div className={`transaction-dot ${isEntrata ? "dot-entrata" : "dot-uscita"}`} />
                <div className="transaction-info">
                  <span className="transaction-label">{item.label}</span>
                  <span className="transaction-date">{fmtDate(item.createdAt)}</span>
                </div>
                <span className={`transaction-amount ${isEntrata ? "amount-entrata" : "amount-uscita"}`}>
                  {isEntrata ? "+" : "-"}{fmt(item.value)} €
                </span>
                <span className="transaction-edit-hint">✎</span>
              </li>
            ))
          )}
        </ul>
      </div>

      <TransactionModal
        transaction={selected}
        type={type}
        onClose={() => setSelected(null)}
        onSave={() => onRefresh()} 
        onDelete={() => onRefresh()} 
      />
    </>
  );
}