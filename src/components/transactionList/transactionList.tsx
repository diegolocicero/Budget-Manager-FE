// src/components/transactionList/TransactionList.tsx
import "./transactionList.css";

interface Transaction {
  id: number;
  label: string;
  value: number;
  createdAt: string;
}

interface Props {
  type: "entrata" | "uscita";
  transactions: Transaction[];
}

const fmt = (n: number) =>
  n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short" });

export default function TransactionList({ type, transactions }: Props) {
  const isEntrata = type === "entrata";

  return (
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
            <li key={item.id} className="transaction-item">
              <div className={`transaction-dot ${isEntrata ? "dot-entrata" : "dot-uscita"}`} />
              <div className="transaction-info">
                <span className="transaction-label">{item.label}</span>
                <span className="transaction-date">{fmtDate(item.createdAt)}</span>
              </div>
              <span className={`transaction-amount ${isEntrata ? "amount-entrata" : "amount-uscita"}`}>
                {isEntrata ? "+" : "-"}{fmt(item.value)} €
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}