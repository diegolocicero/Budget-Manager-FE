import  { useEffect, useState } from "react";
import "./Insight.css";
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend, 
    type ChartData, 
    type ChartOptions 
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { DepositAPIService } from "../../services/DepositAPIService";
import { WithdrawalAPIService } from "../../services/WithdrawalAPIService";
import type { TransactionResponse } from "../../interface/TransactionResponse";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AggregatedData {
    label: string;
    value: number;
}

export default function Insight() {
    const [deposits, setDeposits] = useState<AggregatedData[]>([]);
    const [withdrawals, setWithdrawals] = useState<AggregatedData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [resDeposits, resWithdrawals] = await Promise.all([
                    DepositAPIService.getAll(),
                    WithdrawalAPIService.getAll()
                ]);

                setDeposits(aggregateData(resDeposits));
                setWithdrawals(aggregateData(resWithdrawals));
            } catch (error) {
                console.error("Errore nel caricamento dati:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const aggregateData = (data: TransactionResponse[]): AggregatedData[] => {
        if (!data || data.length === 0) return [];
        const map = data.reduce((acc: Record<string, number>, item) => {
            const key = item.label || "Altro";
            acc[key] = (acc[key] || 0) + item.value;
            return acc;
        }, {});

        return Object.keys(map).map(key => ({
            label: key,
            value: map[key]
        }));
    };

    // Funzione per calcolare il totale di una lista
    const calculateTotal = (data: AggregatedData[]) => 
        data.reduce((sum, item) => sum + item.value, 0).toLocaleString("it-IT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const generateHighContrastColors = (hue: number, count: number) => {
        const lightnessPattern = [35, 75, 50, 90, 25, 60, 40]; 
        return Array.from({ length: count }, (_, i) => {
            const l = lightnessPattern[i % lightnessPattern.length];
            return `hsla(${hue}, 90%, ${l}%, 0.9)`;
        });
    };

    const getChartConfig = (data: AggregatedData[], title: string, hue: number): ChartData<"doughnut"> => ({
        labels: data.map(d => d.label),
        datasets: [{
            label: title,
            data: data.map(d => d.value),
            backgroundColor: generateHighContrastColors(hue, data.length),
            borderColor: "rgba(0, 0, 0, 0.8)", 
            borderWidth: 4,
            hoverOffset: 35, 
        }]
    });

    const options: ChartOptions<"doughnut"> = {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 40 },
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: { 
                    padding: 30, 
                    color: '#C9BEFF', 
                    font: { size: 14, weight: 'bold' },
                    usePointStyle: true,
                }
            },
            tooltip: {
                backgroundColor: 'rgba(28, 77, 141, 0.95)',
                titleColor: '#BDE8F5',
                bodyColor: '#C9BEFF',
                titleFont: { size: 16, weight: 'bold' },
                bodyFont: { size: 14 },
                padding: 15,
                cornerRadius: 15,
                displayColors: true,
                borderColor: 'rgba(73, 136, 196, 0.5)',
                borderWidth: 1
            }
        },
        cutout: '65%'
    };

    if (loading) return <div className="loading-state">ANALYZING DATA...</div>;

    return (
        <div className="insight-container">
            <div className="charts-grid">
                <section className="chart-card">
                    <div className="card-header">
                        <h2>Entrate</h2>
                        <div className="chart-total total-deposits">
                            +{calculateTotal(deposits)} €
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        {deposits.length > 0 ? (
                            <Doughnut data={getChartConfig(deposits, "Entrate (€)", 140)} options={options} />
                        ) : (
                            <div className="empty-state-msg">Nessun deposito fatto</div>
                        )}
                    </div>
                </section>

                <section className="chart-card">
                    <div className="card-header">
                        <h2>Uscite</h2>
                        <div className="chart-total total-withdrawals">
                            -{calculateTotal(withdrawals)} €
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        {withdrawals.length > 0 ? (
                            <Doughnut data={getChartConfig(withdrawals, "Uscite (€)", 0)} options={options} />
                        ) : (
                            <div className="empty-state-msg">Nessuna spesa fatta</div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}