import React, { useEffect, useState } from "react";
import { TimerIcon } from "lucide-react";

interface CountdownTimerProps {
  tokenTime: string; // Expected format: "2025-03-20T12:34:56Z"
}

export function CountdownTimer({ tokenTime }: CountdownTimerProps) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!tokenTime) return;

    // Convert tokenTime to Date object and calculate 24-hour expiry time
    const tokenDate = new Date(tokenTime);
    const expiryDate = new Date(tokenDate.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours

    const updateTimer = () => {
      const now = new Date();
      const timeLeft = expiryDate.getTime() - now.getTime();

      if (timeLeft <= 0) {
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setTime({ hours, minutes, seconds });
    };

    updateTimer(); // Initialize immediately
    const timer = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(timer);
  }, [tokenTime]);

  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
      <TimerIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
      <div className="font-mono text-lg font-medium text-slate-900 dark:text-white">
        {String(time.hours).padStart(2, "0")}:
        {String(time.minutes).padStart(2, "0")}:
        {String(time.seconds).padStart(2, "0")}
      </div>
    </div>
  );
}
