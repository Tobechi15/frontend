import React, { useEffect, useState } from "react";
import { TimerIcon } from "lucide-react";
export function CountdownTimer() {
  const [time, setTime] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prevTime => {
        const newSeconds = prevTime.seconds - 1;
        const newMinutes = newSeconds < 0 ? prevTime.minutes - 1 : prevTime.minutes;
        const newHours = newMinutes < 0 ? prevTime.hours - 1 : prevTime.hours;
        return {
          hours: newHours < 0 ? 23 : newHours,
          minutes: newMinutes < 0 ? 59 : newMinutes,
          seconds: newSeconds < 0 ? 59 : newSeconds
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
      <TimerIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
      <div className="font-mono text-lg font-medium text-slate-900 dark:text-white">
        {String(time.hours).padStart(2, "0")}:
        {String(time.minutes).padStart(2, "0")}:
        {String(time.seconds).padStart(2, "0")}
      </div>
    </div>;
}