import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const currency = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(v || 0);

export default function RestaurantsPage() {
  const { token, isAdmin } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [cart, setCart] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState(null);

  const [menuForm, setMenuForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    price: ""
  });
  const [editingItem, setEditingItem] = useState(null);

  const handleLocalImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be 2MB or less");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setMenuForm((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const { data } = await api.get("/api/restaurants");
        const list = Array.isArray(data) ? data : [];
        setRestaurants(list);
        if (list.length && !selectedRestaurantId) {
          setSelectedRestaurantId(list[0]._id);
        }
      } catch {
        toast.error("Unable to load restaurants");
      }
    };

    loadRestaurants();
  }, []);

  useEffect(() => {
    setCart([]);
    setCheckoutResult(null);
    setEditingItem(null);
  }, [selectedRestaurantId]);

  const selectedRestaurant = restaurants.find((r) => r._id === selectedRestaurantId);
  const menu = selectedRestaurant?.menu || [];

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = (item) => {
    if (!item.isAvailable) {
      toast.error("This item is unavailable");
      return;
    }

    setCart((prev) => {
      const found = prev.find((c) => c.menuItemId === item._id);
      if (found) {
        return prev.map((c) =>
          c.menuItemId === item._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: 1
        }
      ];
    });
  };

  const updateQty = (menuItemId, nextQty) => {
    if (nextQty < 1) {
      setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
      return;
    }
    setCart((prev) => prev.map((c) => (c.menuItemId === menuItemId ? { ...c, quantity: nextQty } : c)));
  };

  const handleCheckout = async () => {
    if (!token) {
      toast.error("Please login to make payment");
      return;
    }
    if (!selectedRestaurantId || cart.length === 0) {
      toast.error("Add items to cart first");
      return;
    }

    setCheckoutLoading(true);
    try {
      const payload = {
        restaurantId: selectedRestaurantId,
        items: cart.map((c) => ({ menuItemId: c.menuItemId, quantity: c.quantity })),
        totalAmount: cartTotal
      };

      const { data } = await api.post("/api/transactions", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCheckoutResult(data);
      setCart([]);

      if (data?.reward?.rewardAmount) {
        toast.success(`Payment successful. Reward earned: ${currency(data.reward.rewardAmount)}`);
      } else {
        toast.success("Payment successful. No eligible reward for this order.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const refreshRestaurants = async () => {
    const { data } = await api.get("/api/restaurants");
    const list = Array.isArray(data) ? data : [];
    setRestaurants(list);
  };

  const resetForm = () => {
    setMenuForm({ name: "", description: "", imageUrl: "", price: "" });
    setEditingItem(null);
  };

  const submitMenu = async (e) => {
    e.preventDefault();
    if (!isAdmin || !token || !selectedRestaurantId) return;

    try {
      const body = {
        name: menuForm.name,
        description: menuForm.description,
        imageUrl: menuForm.imageUrl,
        price: Number(menuForm.price)
      };

      if (!body.name || Number.isNaN(body.price)) {
        toast.error("Enter valid menu name and price");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      if (editingItem?._id) {
        await api.patch(
          `/api/restaurants/${selectedRestaurantId}/menu/${editingItem._id}`,
          body,
          { headers }
        );
        toast.success("Menu item updated");
      } else {
        await api.post(`/api/restaurants/${selectedRestaurantId}/menu`, body, { headers });
        toast.success("Menu item added");
      }

      await refreshRestaurants();
      resetForm();
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      const status = error?.response?.status;
      const networkMessage = error?.message;
      toast.error(backendMessage || (status ? `Save failed (${status})` : networkMessage || "Unable to save menu item"));
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      price: String(item.price || "")
    });
  };

  const deleteMenu = async (itemId) => {
    if (!isAdmin || !token || !selectedRestaurantId) return;
    try {
      await api.delete(`/api/restaurants/${selectedRestaurantId}/menu/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Menu item deleted");
      await refreshRestaurants();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete menu item");
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
          <h2 className="mb-4 font-display text-2xl font-semibold">Restaurants & Menu</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {restaurants.map((r) => (
              <button
                key={r._id}
                onClick={() => setSelectedRestaurantId(r._id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  selectedRestaurantId === r._id
                    ? "border-cyan-300/50 bg-cyan-300/10"
                    : "border-white/15 bg-white/5 hover:bg-white/10"
                }`}
              >
                <p className="font-display text-lg font-semibold">{r.name}</p>
                <p className="mt-1 text-sm text-slate-300">{r.location || "Unknown"}</p>
                <p className="mt-2 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-2 py-0.5 text-xs text-cyan-100">
                  {r.category || "General"}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Menu</h3>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {selectedRestaurant?.name || "Select a restaurant"}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {menu.map((item) => (
              <motion.div key={item._id} whileHover={{ y: -3 }} className="rounded-xl border border-white/15 bg-black/20 p-3">
                <div className="aspect-square overflow-hidden rounded-lg border border-white/10 bg-slate-800/70">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-xs text-slate-300">
                      No Image
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <p className="font-medium leading-snug">{item.name}</p>
                  <p className="mt-1 text-sm font-semibold text-cyan-100">{currency(item.price)}</p>
                </div>

                <p className="mt-1 text-xs text-slate-300">{item.description || "No description"}</p>
                {!item.isAvailable && <p className="mt-1 text-xs text-red-300">Currently unavailable</p>}

                <div className="mt-3 flex gap-2">
                  <button
                    disabled={!item.isAvailable}
                    onClick={() => addToCart(item)}
                    className="rounded-lg bg-gradient-to-r from-cyan-300 to-blue-500 px-3 py-1.5 text-xs font-semibold text-midnight disabled:opacity-60"
                  >
                    Add to Cart
                  </button>

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => startEdit(item)}
                        className="rounded-lg border border-white/20 px-3 py-1.5 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMenu(item._id)}
                        className="rounded-lg border border-red-300/40 bg-red-400/10 px-3 py-1.5 text-xs text-red-200"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {menu.length === 0 && <p className="text-sm text-slate-400">No menu items available for this restaurant.</p>}
        </div>

        {isAdmin && (
          <div className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
            <h3 className="font-display text-xl font-semibold">Admin Menu Manager</h3>
            <form onSubmit={submitMenu} className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                value={menuForm.name}
                onChange={(e) => setMenuForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Item name"
                className="rounded-xl border border-white/20 bg-black/25 px-3 py-2"
              />
              <input
                type="number"
                min="1"
                value={menuForm.price}
                onChange={(e) => setMenuForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="Price"
                className="rounded-xl border border-white/20 bg-black/25 px-3 py-2"
              />
              <input
                value={menuForm.description}
                onChange={(e) => setMenuForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Description"
                className="rounded-xl border border-white/20 bg-black/25 px-3 py-2 md:col-span-2"
              />
              <input
                value={menuForm.imageUrl}
                onChange={(e) => setMenuForm((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="Image URL (optional)"
                className="rounded-xl border border-white/20 bg-black/25 px-3 py-2 md:col-span-2"
              />
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Upload From Laptop</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLocalImageSelect}
                  className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-300/20 file:px-3 file:py-1.5 file:text-cyan-100"
                />
                <p className="mt-1 text-xs text-slate-400">Max size: 2MB. JPG, PNG, WEBP supported.</p>
              </div>

              {menuForm.imageUrl && (
                <div className="md:col-span-2">
                  <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Image Preview</p>
                  <div className="flex items-start gap-3">
                    <div className="h-20 w-20 overflow-hidden rounded-lg border border-white/15 bg-slate-800/70">
                      <img src={menuForm.imageUrl} alt="Menu preview" className="h-full w-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setMenuForm((p) => ({ ...p, imageUrl: "" }))}
                      className="rounded-lg border border-red-300/40 bg-red-400/10 px-3 py-1.5 text-xs text-red-200"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 md:col-span-2">
                <button className="rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-4 py-2 font-semibold text-midnight">
                  {editingItem ? "Update Item" : "Add Item"}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-white/20 px-4 py-2"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/6 p-5 backdrop-blur-xl">
        <h3 className="font-display text-2xl font-semibold">Cart & Checkout</h3>
        <p className="mt-1 text-sm text-slate-300">Review your order and simulate payment.</p>

        <div className="mt-4 space-y-2">
          {cart.map((c) => (
            <div key={c.menuItemId} className="rounded-xl border border-white/15 bg-black/20 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-sm text-cyan-100">{currency(c.price * c.quantity)}</p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => updateQty(c.menuItemId, c.quantity - 1)}
                  className="h-7 w-7 rounded-md border border-white/20"
                >
                  -
                </button>
                <span className="text-sm">{c.quantity}</span>
                <button
                  onClick={() => updateQty(c.menuItemId, c.quantity + 1)}
                  className="h-7 w-7 rounded-md border border-white/20"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && <p className="text-sm text-slate-400">Your cart is empty.</p>}
        </div>

        <div className="mt-5 rounded-xl border border-white/15 bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-300">Total</p>
            <p className="font-semibold text-cyan-100">{currency(cartTotal)}</p>
          </div>
          <button
            disabled={checkoutLoading || cart.length === 0}
            onClick={handleCheckout}
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-300 to-teal-400 px-4 py-2 font-semibold text-midnight disabled:opacity-60"
          >
            {checkoutLoading ? "Processing Payment..." : "Pay Now"}
          </button>
        </div>

        {checkoutResult && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-emerald-300/25 bg-emerald-400/10 p-4"
          >
            <p className="text-sm font-semibold text-emerald-100">Payment Successful</p>
            <p className="mt-1 text-sm text-slate-200">
              Paid: {currency(checkoutResult?.transaction?.totalAmount || checkoutResult?.transaction?.amount)}
            </p>
            <p className="text-sm text-slate-200">
              Reward: {checkoutResult?.reward?.rewardAmount ? currency(checkoutResult.reward.rewardAmount) : "Not eligible"}
            </p>
            <p className="text-xs text-slate-300">
              Offer: {checkoutResult?.appliedOffer ? checkoutResult.appliedOffer._id : "No offer applied"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
