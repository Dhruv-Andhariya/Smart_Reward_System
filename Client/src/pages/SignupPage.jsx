import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, login, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      await login(form.email, form.password);
      toast.success("Account created");
      navigate("/app");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-bg flex min-h-screen items-center justify-center p-4">
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-2xl">
        <h1 className="font-display text-3xl font-semibold">Create Account</h1>
        <p className="mt-2 text-sm text-slate-300">Join Smart Reward System in minutes.</p>

        <div className="mt-6 space-y-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} type="text" placeholder="Full Name" required className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3 outline-none focus:border-cyan-300" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email" required className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3 outline-none focus:border-cyan-300" />
          <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" placeholder="Password" required className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3 outline-none focus:border-cyan-300" />
        </div>

        <button disabled={loading} className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-4 py-3 font-semibold text-midnight disabled:opacity-60">
          {loading ? "Creating account..." : "Signup"}
        </button>

        <p className="mt-4 text-sm text-slate-300">
          Already have an account? <Link to="/login" className="text-cyan-200">Login</Link>
        </p>
      </motion.form>
    </div>
  );
}
