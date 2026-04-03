import { useEffect, useState } from "react";
import api from "../lib/api";

const currency = (v) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v || 0);

export default function OffersPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState("");
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const loadRestaurants = async () => {
      const { data } = await api.get("/api/restaurants");
      setRestaurants(data || []);
      if (data?.length) setSelected(data[0]._id);
    };
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (!selected) return;
    api.get(`/api/offers/${selected}`).then((res) => setOffers(res.data || []));
  }, [selected]);

  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-semibold">Offers by Restaurant</h2>
      <div className="mb-4">
        <select
          className="rounded-xl border border-white/20 bg-black/30 px-3 py-2"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>{r.name}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {offers.map((offer) => (
          <div key={offer._id} className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
            <p className="text-xs text-cyan-100">Cashback Offer</p>
            <p className="mt-2 font-display text-2xl font-semibold">
              {offer.cashback ? currency(offer.cashback) : `${offer.percentage}%`}
            </p>
            <p className="mt-2 text-sm text-slate-300">Min amount: {currency(offer.minAmount)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
