import React, { useState } from "react";
import { SearchBar } from "../components/common/SearchBar";
import { CountdownTimer } from "../components/tokens/CountdownTimer";
import { CopyableAddress } from "../components/tokens/CopyableAddress";
import { formatNumber, formatDateTime, formatPercentage } from "../utils/formatters";
// Mock data
const mockTokens = [{
  id: 1,
  address: "0x1234567890abcdef1234567890abcdef12345678",
  symbol: "ETH",
  name: "Ethereum",
  decimals: 18,
  lastTradeTime: 1674201600,
  // Unix timestamp
  liquidity: 2500000000,
  marketCap: 450000000000,
  volumeChange24h: 12.5,
  volume24h: 15000000000
}
// Add more mock tokens as needed
];
export function Tokens() {
  const [searchQuery, setSearchQuery] = useState("");
  return <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl font-bold dark:text-white">Tokens</h1>
        <CountdownTimer />
      </div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search tokens..." />
      {/* Desktop Table View */}
      <div className="bg-white dark:bg-slate-800 dark:border-slate-700 rounded-lg p-2 border border-slate-200 hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-slate-400 text-sm">
              <th className="text-left pb-4">Token</th>
              <th className="text-left pb-4">Address</th>
              <th className="text-right pb-4">Decimals</th>
              <th className="text-right pb-4">Last Trade</th>
              <th className="text-right pb-4">Liquidity</th>
              <th className="text-right pb-4">Market Cap</th>
              <th className="text-right pb-4">24h Change</th>
              <th className="text-right pb-4">24h Volume</th>
            </tr>
          </thead>
          <tbody>
            {mockTokens.map(token => <tr key={token.id} className="border-t border-slate-700">
                <td className="py-4">
                  <div className="flex flex-col">
                    <span className="font-medium dark:text-white">
                      {token.symbol}
                    </span>
                    <span className="text-sm dark:text-slate-400">{token.name}</span>
                  </div>
                </td>
                <td className="py-4">
                  <CopyableAddress address={token.address} />
                </td>
                <td className="text-right dark:text-white">{token.decimals}</td>
                <td className="text-right dark:text-slate-300">
                  {formatDateTime(token.lastTradeTime)}
                </td>
                <td className="text-right dark:text-white">
                  ${formatNumber(token.liquidity)}
                </td>
                <td className="text-right dark:text-white">
                  ${formatNumber(token.marketCap)}
                </td>
                <td className={`text-right ${token.volumeChange24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {formatPercentage(token.volumeChange24h)}
                </td>
                <td className="text-right dark:text-white">
                  ${formatNumber(token.volume24h)}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {mockTokens.map(token => <div key={token.id} className="bg-white dark:bg-slate-800 dark:border-slate-700  p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className="font-medium dark:text-white">{token.symbol}</span>
                <span className="text-sm text-slate-600">{token.name}</span>
              </div>
              <div className={`text-sm ${token.volumeChange24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatPercentage(token.volumeChange24h)}
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
                <span className="dark:text-white">
                  {formatDateTime(token.lastTradeTime)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Liquidity</span>
                <span className="dark:text-white">
                  ${formatNumber(token.liquidity)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Market Cap</span>
                <span className="dark:text-white">
                  ${formatNumber(token.marketCap)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">24h Volume</span>
                <span className="dark:text-white">
                  ${formatNumber(token.volume24h)}
                </span>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
}