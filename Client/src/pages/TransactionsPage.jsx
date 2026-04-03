import { useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const currency = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v || 0);

export default function TransactionsPage() {
  const { token, isAdmin } = useAuth();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const loadTransactions = async () => {
      const endpoint = isAdmin ? "/api/transactions" : "/api/transactions/user";
      const { data } = await api.get(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      setRows(Array.isArray(data) ? data : data?.value || []);
    };

    if (token) {
      loadTransactions();
    }
  }, [token, isAdmin]);

  return (
    <div className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
      <h2 className="font-display text-2xl font-semibold">Transactions</h2>
      <p className="mt-1 text-sm text-slate-300">
        {isAdmin ? "Showing all users' payments." : "Order and payment history with itemized details."}
      </p>

      <div className="mt-4 space-y-3">
        {rows.map((tx) => (
          <div key={tx._id} className="rounded-xl border border-white/15 bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-400">{new Date(tx.createdAt || tx.date).toLocaleString()}</p>
              <p className="font-semibold text-cyan-100">{currency(tx.totalAmount || tx.amount)}</p>
            </div>
            <p className="mt-1 text-sm text-slate-300">Restaurant ID: {String(tx.restaurantId)}</p>

            {Array.isArray(tx.items) && tx.items.length > 0 && (
              <div className="mt-3 space-y-1">
                {tx.items.map((item) => (
                  <div key={`${tx._id}-${item.menuItemId}`} className="flex items-center justify-between text-xs text-slate-300">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>{currency(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {rows.length === 0 && <p className="text-sm text-slate-400">No transactions yet.</p>}
      </div>
    </div>
  );
}
