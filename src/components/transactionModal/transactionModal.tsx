import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { DepositAPIService } from "../../services/DepositAPIService";
import { WithdrawalAPIService } from "../../services/WithdrawalAPIService";
import "./transactionModal.css";

interface Transaction {
  id: number;
  label: string;
  value: number;
  createdAt: string;
}

interface Props {
  transaction: Transaction | null;
  type: "entrata" | "uscita";
  onClose: () => void;
  onSave: (updated: Transaction) => void;
  onDelete: (id: number) => void;
}

export default function TransactionModal({ transaction, type, onClose, onSave, onDelete }: Props) {
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [visible, setVisible] = useState(false);

  const isEntrata = type === "entrata";

  useEffect(() => {
    if (transaction) {
      setLabel(transaction.label);
      setValue(String(transaction.value));
      setConfirmDelete(false);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [transaction]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const handleSave = async () => {
    if (!transaction) return;
    setLoading(true);
    try {
      const payload = { label, value: parseFloat(value) || 0 };
      const result = isEntrata
        ? await DepositAPIService.update(transaction.id, payload)
        : await WithdrawalAPIService.update(transaction.id, payload);
      onSave({ ...transaction, ...result });
      toast.success("Transazione aggiornata");
      handleClose();
    } catch {
      toast.error("Salvataggio fallito. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setLoading(true);
    try {
      if (isEntrata) {
        await DepositAPIService.delete(transaction.id);
      } else {
        await WithdrawalAPIService.delete(transaction.id);
      }
      onDelete(transaction.id);
      toast.success("Transazione eliminata");
      handleClose();
    } catch {
      toast.error("Eliminazione fallita. Riprova.");
      setConfirmDelete(false);
    } finally {
      setLoading(false);
    }
  };

  if (!transaction) return null;

  return (
    <div className={`tm-overlay ${visible ? "tm-overlay--visible" : ""}`} onClick={handleClose}>
      <div
        className={`tm-panel ${visible ? "tm-panel--visible" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tm-header">
          <div className={`tm-badge ${isEntrata ? "tm-badge--entrata" : "tm-badge--uscita"}`}>
            <span className="tm-badge-arrow">{isEntrata ? "↑" : "↓"}</span>
            <span>{isEntrata ? "Entrata" : "Uscita"}</span>
          </div>
          <button className="tm-close" onClick={handleClose} aria-label="Chiudi">✕</button>
        </div>

        <div className="tm-divider" />

        <div className="tm-body">
          <div className="tm-field">
            <label className="tm-label">Descrizione</label>
            <input
              className="tm-input"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Es. Stipendio, Affitto…"
            />
          </div>

          <div className="tm-row">
            <div className="tm-field">
              <label className="tm-label">Importo (€)</label>
              <div className="tm-input-prefix-wrap">
                <span className={`tm-prefix ${isEntrata ? "tm-prefix--entrata" : "tm-prefix--uscita"}`}>
                  {isEntrata ? "+" : "−"}
                </span>
                <input
                  className="tm-input tm-input--prefixed"
                  type="number"
                  min="0"
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="tm-divider" />

        <div className="tm-footer">
          <button
            className={`tm-btn tm-btn--delete ${confirmDelete ? "tm-btn--confirm" : ""}`}
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && confirmDelete ? "…" : confirmDelete ? "Conferma" : "Elimina"}
          </button>
          <button className="tm-btn tm-btn--save" onClick={handleSave} disabled={loading}>
            {loading && !confirmDelete ? "Salvataggio…" : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
}