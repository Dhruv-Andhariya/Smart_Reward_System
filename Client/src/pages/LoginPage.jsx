import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate(location.state?.from?.pathname || "/app");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-bg flex min-h-screen items-center justify-center p-4">
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-2xl">
        <h1 className="font-display text-3xl font-semibold">Welcome Back</h1>
        <p className="mt-2 text-sm text-slate-300">Login to access your reward dashboard.</p>

        <div className="mt-6 space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3 outline-none focus:border-cyan-300" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3 outline-none focus:border-cyan-300" />
        </div>

        <button disabled={loading} className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 px-4 py-3 font-semibold text-midnight disabled:opacity-60">
          {loading ? "Signing in..." : "Login"}
        </button>

        <p className="mt-4 text-sm text-slate-300">
          New user? <Link to="/signup" className="text-cyan-200">Create account</Link>
        </p>
      </motion.form>
    </div>
  );
}
