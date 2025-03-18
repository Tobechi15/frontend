import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Sidebar } from "./components/Layout/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Tokens } from "./pages/Tokens";
import { Charts } from "./pages/Charts";
import { ThemeProvider } from "./context/ThemeContext";
export function App() {
  const isAuthenticated = true;
  if (!isAuthenticated) {
    return <ThemeProvider>
        <Login />
      </ThemeProvider>;
  }
  return <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
          <Sidebar />
          <main className="flex-1 ml-0 mt-16 lg:ml-64 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/tokens" element={<Tokens />} />
              <Route path="/charts" element={<Charts />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>;
}