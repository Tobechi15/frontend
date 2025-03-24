import React, { useState, useEffect } from "react";
import { SearchBar } from "../components/common/SearchBar";
import { CountdownTimer } from "../components/tokens/CountdownTimer";
import { CopyableAddress } from "../components/tokens/CopyableAddress";
import { formatNumber, formatDateTime } from "../utils/formatters";
import { DataCard } from "../components/common/DataCard";
import { WalletIcon, CoinsIcon, ArrowLeftRightIcon, DollarSignIcon} from "lucide-react";

interface Token {
  address: string;
  decimals: number;
  lastTradeUnixTime: number;
  liquidity: number;
  name: string;
  symbol: string;
}

interface ApiResponse {
  tokens: Token[];
  time: string; // Adjust type if needed (e.g., Date)
}

export function Tokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [FetchTime, setFetchTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch("https://arb-bot-b6wc.onrender.com/tokens");
        if (!response.ok) throw new Error("Failed to fetch tokens");
    
        const data: ApiResponse = await response.json();
        
        setTokens(data.tokens);  // Extract tokens
        setFetchTime(data.time); // Store fetch time separately
    
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const total = filteredTokens.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl font-bold dark:text-white">Tokens</h1>
        <CountdownTimer tokenTime={FetchTime} />
      </div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search tokens..." />

      <DataCard title="Total Transactions" value={total} icon={<ArrowLeftRightIcon className="w-5 h-5" />} />

      {loading ? (
        <p className="text-center text-gray-500">Loading tokens...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="bg-white dark:bg-slate-800 dark:border-slate-700 rounded-lg p-2 border border-slate-200 hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-sm">
                  <th className="text-left pb-4">Symbol</th>
                  <th className="text-left pb-4">Name</th>
                  <th className="text-left pb-4">Address</th>
                  <th className="text-right pb-4">Decimals</th>
                  <th className="text-right pb-4">Last Trade</th>
                  <th className="text-right pb-4">Liquidity</th>
                </tr>
              </thead>
              <tbody>
                {filteredTokens.map((token, index) => (
                  <tr key={index} className="border-t border-slate-700">
                    <td className="py-4 font-medium dark:text-white">{token.symbol}</td>
                    <td className="py-4 dark:text-white">{token.name}</td>
                    <td className="py-4">
                      <CopyableAddress address={token.address} />
                    </td>
                    <td className="text-right dark:text-white">{token.decimals}</td>
                    <td className="text-right dark:text-slate-300">{formatDateTime(token.lastTradeUnixTime)}</td>
                    <td className="text-right dark:text-white">${formatNumber(token.liquidity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredTokens.map((token, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 dark:border-slate-700 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="font-medium dark:text-white">{token.symbol}</span>
                    <span className="text-sm text-slate-600">{token.name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Address</span>
                    <CopyableAddress address={token.address} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Decimals</span>
                    <span className="dark:text-white">{token.decimals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Last Trade</span>
                    <span className="dark:text-white">{formatDateTime(token.lastTradeUnixTime)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Liquidity</span>
                    <span className="dark:text-white">${formatNumber(token.liquidity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
