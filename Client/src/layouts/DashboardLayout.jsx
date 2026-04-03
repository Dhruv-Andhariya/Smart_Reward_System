import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/app" },
  { label: "Transactions", to: "/app/transactions" },
  { label: "Restaurants", to: "/app/restaurants" },
  { label: "Offers", to: "/app/offers" },
  { label: "Rewards", to: "/app/rewards" },
  { label: "Admin", to: "/app/admin" }
];

export default function DashboardLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-midnight text-slate-100">
      <div className="mx-auto flex w-[95%] max-w-7xl gap-5 py-5">
        <aside className="hidden w-64 shrink-0 rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl lg:block">
          <div className="mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500" />
            <h2 className="mt-3 font-display text-xl font-semibold">Smart Reward</h2>
            <p className="text-xs text-slate-400">Growth dashboard</p>
          </div>

          <nav className="space-y-2">
            {navItems.filter((item) => (item.to === "/app/admin" ? isAdmin : true)).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/app"}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2 text-sm transition ${
                    isActive ? "bg-cyan-300/20 text-cyan-100" : "text-slate-300 hover:bg-white/10"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="mt-6 w-full rounded-xl border border-red-300/30 bg-red-400/10 px-3 py-2 text-sm text-red-100"
          >
            Logout
          </button>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-xl">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">Signed in as</p>
              <p className="font-medium">{user?.email || "user"}</p>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100"
            >
              {user?.role || "user"}
            </motion.div>
          </div>

          <div className="mb-5 flex gap-2 overflow-x-auto rounded-2xl border border-white/15 bg-white/5 p-2 lg:hidden">
            {navItems.filter((item) => (item.to === "/app/admin" ? isAdmin : true)).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/app"}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-lg px-3 py-2 text-xs ${
                    isActive ? "bg-cyan-300/20 text-cyan-100" : "text-slate-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
