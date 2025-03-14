import React, { useState } from "react";
import { HomeIcon, CoinsIcon, LineChartIcon, ArrowLeftRightIcon, SettingsIcon, LogOutIcon, MenuIcon, XIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const {
    ThemeToggle
  } = useTheme();
  const navItems = [{
    icon: HomeIcon,
    label: "Dashboard",
    path: "/"
  }, {
    icon: CoinsIcon,
    label: "Tokens",
    path: "/tokens"
  }, {
    icon: LineChartIcon,
    label: "Charts",
    path: "/charts"
  }, {
    icon: ArrowLeftRightIcon,
    label: "Transactions",
    path: "/transactions"
  }, {
    icon: SettingsIcon,
    label: "Settings",
    path: "/settings"
  }];
  return <>
      {/* Mobile Menu Button */}
      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
        {isMobileOpen ? <XIcon /> : <MenuIcon />}
      </button>
      {/* Sidebar */}
      <aside className={`
          fixed top-0 left-0 h-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-all duration-300
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          z-40 border-r border-slate-200 dark:border-slate-700
        `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h1 className={`font-bold ${isCollapsed ? "text-center" : "text-xl"}`}>
                {isCollapsed ? "AB" : "Arbitrage Bot"}
              </h1>
              {!isCollapsed && <ThemeToggle />}
            </div>
          </div>
          <nav className="flex-1 py-4">
            {navItems.map(item => <Link onClick={() => setActiveTab(item.label)} key={item.label} to={item.path} className={`${activeTab === item.label ? "bg-gray-200 dark:bg-slate-900" : ""} flex items-center px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors`}>
                <item.icon className="w-5 h-5" />
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>)}
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button className="flex items-center w-full px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors">
              <LogOutIcon className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>;
}