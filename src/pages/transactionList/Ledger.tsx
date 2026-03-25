import "./Ledger.css";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import TransactionModal from "../../components/transactionModal/transactionModal";
import { TransactionAPIService } from "../../services/TransactionAPIService";
import type { TransactionResponseWithType } from "../../interface/TransactionResponse";
import type { TransactionType } from "../../constants";

const fmt = (n: number) =>
  n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("it-IT", { day: "2-digit", month: "short", year: "numeric" });

const PAGE_SIZE = 20;

type FilterType = TransactionType | null;

export default function Ledger() {
  const [transactions, setTransactions] = useState<TransactionResponseWithType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [filter, setFilter] = useState<FilterType>(null);
  const [selected, setSelected] = useState<TransactionResponseWithType | null>(null);

  const fetchTransactions = useCallback(async (p: number, f: FilterType) => {
    setLoading(true);
    try {
      const data = await TransactionAPIService.getAll({ page: p, size: PAGE_SIZE, type: f });
      setTransactions(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch {
      toast.error("Impossibile caricare le transazioni.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(page, filter);
  }, [page, filter, fetchTransactions]);

  const handleFilterChange = (f: FilterType) => {
    setFilter(f);
    setPage(0);
  };

  const handleRefresh = () => fetchTransactions(page, filter);

  return (
    <div className="ledger-container">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="ledger-inner">

        <header className="ledger-header">
          <div className="ledger-title-group">
            <h1 className="ledger-title">Ledger</h1>
            <span className="ledger-count">
              {loading ? "—" : `${totalElements} movimenti`}
            </span>
          </div>

          <div className="ledger-filters">
            <button
              className={`filter-btn ${filter === null ? "active" : ""}`}
              onClick={() => handleFilterChange(null)}
            >
              Tutti
            </button>
            <button
              className={`filter-btn filter-btn--entrata ${filter === "DEPOSIT" ? "active" : ""}`}
              onClick={() => handleFilterChange("DEPOSIT")}
            >
              ↑ Entrate
            </button>
            <button
              className={`filter-btn filter-btn--uscita ${filter === "WITHDRAWAL" ? "active" : ""}`}
              onClick={() => handleFilterChange("WITHDRAWAL")}
            >
              ↓ Uscite
            </button>
          </div>
        </header>

        <div className="ledger-card">
          <ul className="ledger-list">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <li key={i} className="ledger-item skeleton-item">
                  <div className="skeleton skeleton-dot" />
                  <div className="ledger-item-info">
                    <div className="skeleton skeleton-label" />
                    <div className="skeleton skeleton-date" />
                  </div>
                  <div className="skeleton skeleton-amount-list" />
                </li>
              ))
            ) : transactions.length === 0 ? (
              <li className="ledger-empty">Nessun movimento trovato</li>
            ) : (
              transactions.map((item) => {
                const isDeposit = item.type === "DEPOSIT";
                return (
                  <li
                    key={`${item.type}-${item.id}`}
                    className="ledger-item ledger-item--clickable"
                    onClick={() => setSelected(item)}
                  >
                    <div className={`transaction-dot ${isDeposit ? "dot-entrata" : "dot-uscita"}`} />
                    <div className="ledger-item-info">
                      <span className="transaction-label">{item.label}</span>
                      <span className="transaction-date">{fmtDate(item.createdAt)}</span>
                    </div>
                    <span className={`transaction-amount ${isDeposit ? "amount-entrata" : "amount-uscita"}`}>
                      {isDeposit ? "+" : "-"}{fmt(item.value)} €
                    </span>
                    <span className="transaction-edit-hint">✎</span>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {!loading && totalPages > 1 && (
          <div className="ledger-pagination">
            <button
              className="page-btn"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ←
            </button>
            <span className="page-info">
              {page + 1} / {totalPages}
            </span>
            <button
              className="page-btn"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              →
            </button>
          </div>
        )}
      </div>

      {selected && (
        <TransactionModal
          transaction={selected}
          type={selected.type === "DEPOSIT" ? "entrata" : "uscita"}
          onClose={() => setSelected(null)}
          onSave={handleRefresh}
          onDelete={handleRefresh}
        />
      )}
    </div>
  );
}