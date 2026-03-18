import "./Home.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { DepositAPIService } from "../../services/DepositAPIService";
import { WithdrawalAPIService } from "../../services/WithdrawalAPIService";
import type { Summary } from "../../interface/ISummary";

export default function Home() {
  const [summary, setSummary] = useState<Summary>({ totEntrate: 0, totUscite: 0 });
  const [loadingSummary, setLoadingSummary] = useState(true);

  const [showModal, setShowModal] = useState<"entrata" | "uscita" | null>(null);
  const [formDesc, setFormDesc] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const [deposits, withdrawals] = await Promise.all([
        DepositAPIService.getAll(),
        WithdrawalAPIService.getAll(),
      ]);
      const totEntrate = deposits.reduce((acc, d) => acc + d.value, 0);
      const totUscite = withdrawals.reduce((acc, w) => acc + w.value, 0);
      setSummary({ totEntrate, totUscite });
    } catch {
      toast.error("Impossibile caricare il riepilogo.");
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleAdd = async (type: "entrata" | "uscita") => {
    if (!formDesc || !formAmount) return;
    setSubmitting(true);
    const label = type === "entrata" ? "Entrata" : "Uscita";

    try {
      if (type === "entrata") {
        await DepositAPIService.addDeposit(formDesc, parseFloat(formAmount));
      } else {
        await WithdrawalAPIService.addWithdrawal(formDesc, parseFloat(formAmount));
      }
      toast.success(`${label} aggiunta con successo!`);
      await fetchSummary();
    } catch {
      toast.error(`Errore durante il salvataggio dell'${label.toLowerCase()}.`);
    } finally {
      setSubmitting(false);
      setShowModal(null);
      setFormDesc("");
      setFormAmount("");
    }
  };

  const balance = summary.totEntrate - summary.totUscite;
  const month = new Date().toLocaleString("it-IT", { month: "long", year: "numeric" });
  const fmt = (n: number) =>
    n.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="home-container">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="home-inner">
        <header className="home-header">
          <div className="header-right">
            <span className="home-month-badge">{month}</span>
            <div className="home-balance-pill" data-positive={balance >= 0}>
              <span className="balance-label">Saldo</span>
              <span className="balance-value">
                {balance >= 0 ? "+" : ""}{fmt(balance)} €
              </span>
            </div>
          </div>
        </header>

        <section className="summary-grid">
          <div className="summary-card card-entrate">
            <div className="card-glow glow-entrate" />
            <div className="card-header-row">
              <span className="card-label">Totale Entrate</span>
              <span className="card-icon card-icon-up">↑</span>
            </div>
            <div className="card-amount">
              {loadingSummary ? (
                <span className="skeleton" />
              ) : (
                <span className="amount-value">
                  {fmt(summary.totEntrate)} <span className="amount-currency">€</span>
                </span>
              )}
            </div>
            <div className="card-sub">questo mese</div>
          </div>

          <div className="summary-card card-uscite">
            <div className="card-glow glow-uscite" />
            <div className="card-header-row">
              <span className="card-label">Totale Uscite</span>
              <span className="card-icon card-icon-down">↓</span>
            </div>
            <div className="card-amount">
              {loadingSummary ? (
                <span className="skeleton" />
              ) : (
                <span className="amount-value">
                  {fmt(summary.totUscite)} <span className="amount-currency">€</span>
                </span>
              )}
            </div>
            <div className="card-sub">questo mese</div>
          </div>
        </section>

        <section className="actions-grid">
          <button className="action-btn btn-entrata" onClick={() => setShowModal("entrata")}>
            <div className="btn-ring" />
            <span className="btn-plus">+</span>
            <span className="btn-label">Aggiungi Entrata</span>
          </button>

          <button className="action-btn btn-uscita" onClick={() => setShowModal("uscita")}>
            <div className="btn-ring" />
            <span className="btn-plus">+</span>
            <span className="btn-label">Aggiungi Uscita</span>
          </button>
        </section>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(null)}>
          <div
            className={`modal-card modal-${showModal}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-top">
              <h3 className={showModal === "entrata" ? "modal-title-entrata" : "modal-title-uscita"}>
                {showModal === "entrata" ? "↑ Nuova Entrata" : "↓ Nuova Uscita"}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            </div>

            <div className="modal-field">
              <label>Descrizione</label>
              <input
                type="text"
                placeholder="es. Stipendio, Affitto…"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </div>

            <div className="modal-field">
              <label>Importo (€)</label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
              />
            </div>

            <button
              className="modal-submit"
              disabled={submitting || !formDesc || !formAmount}
              onClick={() => handleAdd(showModal)}
            >
              {submitting ? "Salvataggio…" : "Conferma"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}