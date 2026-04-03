import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { token } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [restaurant, setRestaurant] = useState({ name: "", location: "", category: "" });
  const [offer, setOffer] = useState({ restaurantId: "", minAmount: "", cashback: "", validFrom: "", validTo: "" });

  const headers = { Authorization: `Bearer ${token}` };

  const fetchRestaurants = async () => {
    try {
      const { data } = await api.get("/api/restaurants");
      return Array.isArray(data) ? data : [];
    } catch {
      toast.error("Unable to load restaurants");
      return [];
    }
  };

  useEffect(() => {
    let active = true;

    const init = async () => {
      const list = await fetchRestaurants();
      if (!active) return;

      setRestaurants(list);
      setOffer((prev) => {
        if (prev.restaurantId || list.length === 0) {
          return prev;
        }
        return { ...prev, restaurantId: list[0]._id };
      });
    };

    init();

    return () => {
      active = false;
    };
  }, []);

  const addRestaurant = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/restaurants", restaurant, { headers });
      toast.success("Restaurant added");
      setRestaurant({ name: "", location: "", category: "" });
      const list = await fetchRestaurants();
      setRestaurants(list);
      setOffer((prev) => ({
        ...prev,
        restaurantId: prev.restaurantId || (list[0]?._id || "")
      }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add restaurant");
    }
  };

  const createOffer = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/api/offers",
        {
          ...offer,
          minAmount: Number(offer.minAmount),
          cashback: offer.cashback ? Number(offer.cashback) : undefined
        },
        { headers }
      );
      toast.success("Offer created");
      setOffer({ restaurantId: "", minAmount: "", cashback: "", validFrom: "", validTo: "" });
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      const status = error?.response?.status;
      const networkMessage = error?.message;
      toast.error(backendMessage || (status ? `Failed to create offer (${status})` : networkMessage || "Failed to create offer"));
    }
  };

  const removeRestaurant = async (id) => {
    try {
      await api.delete(`/api/restaurants/${id}`, { headers });
      toast.success("Restaurant removed");

      const list = await fetchRestaurants();
      setRestaurants(list);
      setOffer((prev) => {
        if (!list.length) {
          return { ...prev, restaurantId: "" };
        }

        if (list.some((r) => r._id === prev.restaurantId)) {
          return prev;
        }

        return { ...prev, restaurantId: list[0]._id };
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove restaurant");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <div className="space-y-6">
        <form onSubmit={addRestaurant} className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
          <h3 className="font-display text-xl font-semibold">Add Restaurant</h3>
          <div className="mt-4 space-y-3">
            <input value={restaurant.name} onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })} placeholder="Name" required className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2" />
            <input value={restaurant.location} onChange={(e) => setRestaurant({ ...restaurant, location: e.target.value })} placeholder="Location" className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2" />
            <input value={restaurant.category} onChange={(e) => setRestaurant({ ...restaurant, category: e.target.value })} placeholder="Category" className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2" />
            <button className="rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-4 py-2 font-semibold text-midnight">Save Restaurant</button>
          </div>
        </form>

        <div className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
          <h3 className="font-display text-xl font-semibold">Manage Restaurants</h3>
          <div className="mt-4 space-y-2">
            {restaurants.map((r) => (
              <div key={r._id} className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-black/20 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.location || "No location"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeRestaurant(r._id)}
                  className="rounded-lg border border-red-300/40 bg-red-400/10 px-3 py-1.5 text-xs text-red-200"
                >
                  Remove
                </button>
              </div>
            ))}

            {restaurants.length === 0 && <p className="text-sm text-slate-400">No restaurants available.</p>}
          </div>
        </div>
      </div>

      <form onSubmit={createOffer} className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
        <h3 className="font-display text-xl font-semibold">Create Offer</h3>
        <div className="mt-4 space-y-3">
          <select
            value={offer.restaurantId}
            onChange={(e) => setOffer({ ...offer, restaurantId: e.target.value })}
            required
            className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2"
          >
            {restaurants.length === 0 ? (
              <option value="">No restaurants found</option>
            ) : (
              restaurants.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))
            )}
          </select>
          <input value={offer.minAmount} onChange={(e) => setOffer({ ...offer, minAmount: e.target.value })} placeholder="Minimum Amount" required className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2" />
          <input value={offer.cashback} onChange={(e) => setOffer({ ...offer, cashback: e.target.value })} placeholder="Cashback" className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2" />
          <input type="datetime-local" value={offer.validFrom} onChange={(e) => setOffer({ ...offer, validFrom: e.target.value })} required className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2" />
          <input type="datetime-local" value={offer.validTo} onChange={(e) => setOffer({ ...offer, validTo: e.target.value })} required className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2" />
          <button className="rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-4 py-2 font-semibold text-midnight">Publish Offer</button>
        </div>
      </form>
    </div>
  );
}
