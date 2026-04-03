import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);

export default function DashboardHomePage() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [restaurantsRes, txRes] = await Promise.allSettled([
        api.get("/api/restaurants"),
        api.get("/api/transactions", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const nextRestaurants = restaurantsRes.status === "fulfilled" ? restaurantsRes.value.data || [] : [];
      setRestaurants(nextRestaurants);
      setTransactions(txRes.status === "fulfilled" ? txRes.value.data || [] : []);

      const limited = nextRestaurants.slice(0, 3);
      const offerPromises = limited.map((r) => api.get(`/api/offers/${r._id}`));
      const offerRes = await Promise.allSettled(offerPromises);
      const merged = offerRes
        .filter((r) => r.status === "fulfilled")
        .flatMap((r) => r.value.data || []);
      setOffers(merged);
    };

    if (token) load();
  }, [token]);

  const stats = useMemo(() => {
    const totalSpent = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalCashback = Math.round(totalSpent * 0.04);
    return { totalSpent, totalCashback, activeOffers: offers.length };
  }, [transactions, offers]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Total Spent", currency(stats.totalSpent)],
          ["Total Cashback", currency(stats.totalCashback)],
          ["Active Offers", String(stats.activeOffers)]
        ].map(([label, value]) => (
          <motion.div key={label} whileHover={{ y: -4 }} className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
        <h3 className="font-display text-xl font-semibold">Quick Insights</h3>
        <p className="mt-2 text-slate-300">Your app is now wired with live backend routes for restaurants, offers and transactions.</p>
      </div>
    </div>
  );
}
