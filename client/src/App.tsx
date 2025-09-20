import "./App.css";
import Homepage from "./pages/Homepage";
import InventoryPage from "./pages/Inventory";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <div className="font-sans">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/inventory" element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<div className="flex justify-center items-center min-h-screen"><div className="text-center"><h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1><p className="mt-2">You don't have permission to access this page.</p></div></div>} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
