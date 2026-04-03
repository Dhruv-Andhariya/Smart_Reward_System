import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const currency = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v || 0);

export default function RewardsPage() {
  const { token, isAdmin } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [rewardRows, setRewardRows] = useState([]);

  useEffect(() => {
    if (!token) return;
    const txEndpoint = isAdmin ? "/api/transactions" : "/api/transactions/user";
    const rwEndpoint = isAdmin ? "/api/rewards" : "/api/rewards/user";

    api
      .get(txEndpoint, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setTransactions(res.data || []));

    api
      .get(rwEndpoint, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setRewardRows(res.data || []));
  }, [token, isAdmin]);

  const rewards = useMemo(() => {
    const totalSpent = transactions.reduce((sum, tx) => sum + (tx.totalAmount || tx.amount || 0), 0);
    const cashback = rewardRows.reduce((sum, rw) => sum + (rw.rewardAmount || 0), 0);
    return { cashback, totalSpent, count: rewardRows.length };
  }, [transactions, rewardRows]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
        <p className="text-sm text-slate-300">Earned Cashback</p>
        <p className="mt-1 font-display text-3xl font-semibold text-cyan-100">{currency(rewards.cashback)}</p>
        <p className="mt-1 text-xs text-slate-400">Rewards credited: {rewards.count}</p>
      </div>
      <div className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
        <p className="text-sm text-slate-300">Total Eligible Spend</p>
        <p className="mt-1 font-display text-3xl font-semibold">{currency(rewards.totalSpent)}</p>
      </div>
    </div>
  );
}
