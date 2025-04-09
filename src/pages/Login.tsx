import React, { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon, SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

export function Login({ setIsAuthenticated }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { ThemeToggle } = useTheme();

  useEffect(() => {
    const authStatus = sessionStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "tobi" && password === "123456") {
      sessionStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <main className={`${isDarkMode ? "dark:bg-slate-900" : "bg-white"}`}>
      <div className="min-h-screen w-full bg-white dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="absolute top-4 right-4">
        <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-xl border border-slate-200 dark:border-slate-700 transition-colors">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Welcome Back
            </h1>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
