import React, { useState, useEffect } from "react";
import { WalletIcon, CoinsIcon, ArrowLeftRightIcon, DollarSignIcon} from "lucide-react";
import { StatusIndicator } from "../components/common/StatusIndicator";
import { DataCard } from "../components/common/DataCard";
import { CopyableAddress } from "../components/tokens/CopyableAddress";

interface Transaction {
  id: number;
  tokenSymbol: string;
  tokenName: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  profitBnb: number;
  timestamp: number;
}

export function Dashboard() {
  const [isRunning, setIsRunning] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<string>("Loading...");
  const [transactions24h, setTransactions24h] = useState<number>(0);
  const [profitChange24h, setProfitChange24h] = useState<number>(0);
  const [profit24h, setProfit24h] = useState<number>(0);
  const [numtoken, setTokens] = useState<number>(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, balanceRes, tokenres] = await Promise.all([
          fetch("https://arb-bot-rlot.onrender.com/transactions"),
          fetch("https://arb-bot-rlot.onrender.com/bal"),
          fetch("https://arb-bot-rlot.onrender.com/tokens"),
        ]);


        if (!transactionsRes.ok || !balanceRes.ok || !tokenres) {
          throw new Error("Failed to fetch data");
        }
        const tokenData = await tokenres.json()
        const transactionsData = await transactionsRes.json();
        const balanceData = await balanceRes.json();

        if (!Array.isArray(transactionsData)) {
          throw new Error("Invalid transactions format");
        }

        const processedTransactions = transactionsData.map((tx) => ({
          id: tx.id || Math.random(),
          tokenSymbol: tx.tokenSymbol || "Unknown",
          tokenName: tx.tokenName || "Unknown",
          buyPrice: Number(tx.buyPrice) || 0,
          sellPrice: Number(tx.sellPrice) || 0,
          profit: Number(tx.profit) || 0,
          profitBnb: Number(tx.profitBnb) || 0,
          timestamp: tx.timestamp || Date.now(),
        }));

        setTransactions(processedTransactions.slice(0, 5));

        setBalance(balanceData ? balanceData.toString() : "N/A");

        const tokh = tokenData.length;
        setTokens(tokh ? tokh.toString(): "N/A");

        // Calculate last 24h stats
        calculate24hStats(processedTransactions);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTransactions([]);
        setBalance("Error");
      }
    };

    fetchData();
  }, []);

  /** Function to calculate transactions in last 24 hours and profit change */
  const calculate24hStats = (allTransactions: Transaction[]) => {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    console.log("Current Time (ms):", now);

    const last24hTransactions = allTransactions.filter((tx) => {
      const txTime = new Date(tx.timestamp).getTime(); // Convert ISO date to milliseconds
      console.log(`Tx Time: ${txTime}, Within 24h: ${now - txTime <= oneDayMs}`);
      return now - txTime <= oneDayMs;
    });

    const last48hTransactions = allTransactions.filter((tx) => {
      const txTime = new Date(tx.timestamp).getTime();
      return now - txTime > oneDayMs && now - txTime <= 2 * oneDayMs;
    });

    // Sum up profits
    const totalProfit24h = last24hTransactions.reduce((sum, tx) => sum + (tx.profitBnb || 0), 0);
    const totalProfitYesterday = last48hTransactions.reduce((sum, tx) => sum + (tx.profitBnb || 0), 0);

    // Calculate profit change percentage
    const profitChange =
      totalProfitYesterday !== 0
        ? ((totalProfit24h - totalProfitYesterday) / Math.abs(totalProfitYesterday)) * 100
        : totalProfit24h > 0
          ? 100
          : 0;


    // Update state
    setTransactions24h(last24hTransactions.length);
    setProfitChange24h(profitChange);
    const roundedProfit = Number(totalProfit24h.toFixed(2));
    setProfit24h(roundedProfit);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold dark:text-white">Dashboard</h1>
        <StatusIndicator isRunning={isRunning} onToggle={() => setIsRunning(!isRunning)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataCard
          title="Wallet Balance"
          value={`${balance} BNB`}
          icon={<WalletIcon className="w-5 h-5" />}
          change={{ value: 2.5, isPositive: true }}
        />
        <DataCard title="Tokens Fetched" value={numtoken} icon={<CoinsIcon className="w-5 h-5" />} />
        <DataCard title="24h Transactions" value={transactions24h} icon={<ArrowLeftRightIcon className="w-5 h-5" />} />
        <DataCard
          title="24h Profit"
          value={`${profit24h} BNB`}
          icon={<DollarSignIcon className="w-5 h-5" />}
          change={{
            value: Math.abs(profitChange24h),
            isPositive: profitChange24h >= 0,
          }}
        />
      </div>
      <div className="bg-transparent md:bg-white dark:border-slate-700 dark:bg-slate-800 rounded-lg p-2 md:dark:p-6 md:border md:border-slate-200">
        <h2 className="text-lg font-semibold dark:text-white mb-4">Recent Transactions</h2>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-slate-400 text-sm">
                <th className="text-left pb-4">Token Symbol</th>
                <th className="text-left pb-4">Token address</th>
                <th className="text-right pb-4">Buy Price</th>
                <th className="text-right pb-4">Sell Price</th>
                <th className="text-right pb-4">Profit</th>
                <th className="text-right pb-4">Profit (BNB)</th>
                <th className="text-right pb-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="dark:text-white">
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-slate-200 dark:border-slate-700">
                  <td className="py-4">{tx.tokenSymbol}</td>
                  <td className="py-4"><CopyableAddress address={tx.tokenName} /></td>
                  <td className="text-right">${tx.buyPrice.toFixed(2)}</td>
                  <td className="text-right">${tx.sellPrice.toFixed(2)}</td>
                  <td className={`text-right ${tx.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {tx.profit.toFixed(2)}
                  </td>
                  <td className="text-right">{tx.profitBnb.toFixed(6)} BNB</td>
                  <td className="text-right text-slate-400">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white border-slate-200 dark:bg-slate-700/50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium dark:text-white">{tx.tokenSymbol}</span>
                <span className="text-sm text-slate-500">{new Date(tx.timestamp).toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-500">Token Name</div>
                <div className="text-right dark:text-white"><CopyableAddress address={tx.tokenName} /></div>
                <div className="text-slate-500">Buy Price</div>
                <div className="text-right dark:text-white">${tx.buyPrice.toFixed(2)}</div>
                <div className="text-slate-500">Sell Price</div>
                <div className="text-right dark:text-white">${tx.sellPrice.toFixed(2)}</div>
                <div className="text-slate-500">Profit</div>
                <div className={`text-right ${tx.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {tx.profit.toFixed(2)}
                </div>
                <div className="text-slate-500">Profit (BNB)</div>
                <div className="text-right dark:text-white">{tx.profitBnb.toFixed(6)} BNB</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
