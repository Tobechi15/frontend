import React, { useEffect, useState } from "react";
import { PowerIcon } from "lucide-react";

const BOT_URL = "https://arb-bot-b6wc.onrender.com/";
const WEBHOOK_URL = "YOUR_WEBHOOK_URL_HERE"; // Replace with your actual webhook URL

interface StatusIndicatorProps {
  isRunning: boolean;
  setIsRunning: (state: boolean) => void;
}

export function StatusIndicator({ isRunning, setIsRunning }: StatusIndicatorProps) {
  const [loading, setLoading] = useState(false);

  // Function to check bot status
  const checkBotStatus = async () => {
    try {
      const response = await fetch(BOT_URL, { method: "GET" });
      if (response.ok) {
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    } catch (error) {
      setIsRunning(false);
    }
  };

  // Function to start the bot via webhook
  const handleToggle = async () => {
    if (!isRunning) {
      setLoading(true);
      try {
        await fetch(WEBHOOK_URL, { method: "POST" });
        setTimeout(checkBotStatus, 5000); // Wait 5s before checking status again
      } catch (error) {
        console.error("Error starting bot:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Check bot status every 10 seconds
  useEffect(() => {
    checkBotStatus();
    const interval = setInterval(checkBotStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!isRunning) {
    return (
      <div className="flex items-center justify-center mt-[-115px] h-screen bg-white dark:bg-slate-800">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`rounded-full p-4 text-lg font-semibold text-white ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 transition-all"
          }`}
        >
          <PowerIcon className="w-40 h-40 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-slate-900 dark:text-white">Bot Running</span>
      </div>
      <button
        onClick={handleToggle}
        className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
      >
        <PowerIcon className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
