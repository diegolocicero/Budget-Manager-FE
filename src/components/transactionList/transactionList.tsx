import { useState, useEffect } from "react";
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
  transactions: Transaction[];
  onRefresh: () => void;
}

const fmt = (n: number) =>
  n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });

export default function TransactionList({ type, transactions: initialTransactions, onRefresh }: Props) {
  const isEntrata = type === "entrata";

  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const handleSave = (updated: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    onRefresh();
  };

  const handleDelete = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    onRefresh();
  };

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
          {transactions.length === 0 ? (
            <li className="transaction-empty">Nessun movimento recente</li>
          ) : (
            transactions.map((item) => (
              <li
                key={item.id}
                className="transaction-item transaction-item--clickable"
                onClick={() => setSelected(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelected(item)}
                aria-label={`Modifica transazione: ${item.label}`}
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
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}