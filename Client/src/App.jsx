import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHomePage from "./pages/DashboardHomePage";
import TransactionsPage from "./pages/TransactionsPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import OffersPage from "./pages/OffersPage";
import RewardsPage from "./pages/RewardsPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function PageWrap({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();

  return (
    <>
      <Toaster position="top-right" />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrap><LandingPage /></PageWrap>} />
          <Route path="/login" element={<PageWrap><LoginPage /></PageWrap>} />
          <Route path="/signup" element={<PageWrap><SignupPage /></PageWrap>} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PageWrap><DashboardHomePage /></PageWrap>} />
            <Route path="transactions" element={<PageWrap><TransactionsPage /></PageWrap>} />
            <Route path="restaurants" element={<PageWrap><RestaurantsPage /></PageWrap>} />
            <Route path="offers" element={<PageWrap><OffersPage /></PageWrap>} />
            <Route path="rewards" element={<PageWrap><RewardsPage /></PageWrap>} />
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <PageWrap><AdminPage /></PageWrap>
                </AdminRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
