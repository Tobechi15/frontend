import React, { useState, useEffect, useRef } from "react";
import {
  HomeIcon,
  CoinsIcon,
  LineChartIcon,
  ArrowLeftRightIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

interface SidebarProps {
  setIsAuthenticated: (value: boolean) => void;
}

export function Sidebar({ setIsAuthenticated }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { ThemeToggle } = useTheme();

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  const navItems = [
    { icon: HomeIcon, label: "Dashboard", path: "/" },
    { icon: CoinsIcon, label: "Tokens", path: "/tokens" },
    { icon: LineChartIcon, label: "Charts", path: "/charts" },
    { icon: ArrowLeftRightIcon, label: "Transactions", path: "/transactions" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  // Tap outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isMobileOpen
      ) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen]);

  // Swipe to open
  useEffect(() => {
    let touchStartX = 0;

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0].clientX;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touchEndX = event.changedTouches[0].clientX;
      if (touchStartX < 50 && touchEndX > 100) {
        setIsMobileOpen(true);
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <>
      {/* Navbar - Always Visible */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-b border-gray-200 dark:border-gray-700 z-[60]">
        <div className="h-full flex items-center justify-between  px-4 sm:px-6">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="sm:hidden p-2 rounded-full hover:bg-gray-100 z-[70]"
          >
            {isMobileOpen ? <XIcon /> : <MenuIcon />}
          </button>

          {/* Logo */}
          <h1 className="text-lg sm:text-xl font-bold pl-6 text-blue-600">Arbitrage Bot</h1>

          <div className="sm:flex right-0 items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all duration-300
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 z-40 border-r border-slate-200 dark:border-slate-700`}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 pt-2 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h1 className={`font-bold ${isCollapsed ? "text-center" : "text-xl"}`}>
                {isCollapsed ? "AB" : "Arbitrage Bot"}
              </h1>
              {!isCollapsed && <ThemeToggle />}
            </div>
          </div>
          <nav className="flex-1 mt-8 py-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="flex items-center px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors">
              <LogOutIcon className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
