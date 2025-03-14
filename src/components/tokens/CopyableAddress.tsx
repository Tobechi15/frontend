import React, { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
interface CopyableAddressProps {
  address: string;
}
export function CopyableAddress({
  address
}: CopyableAddressProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  return <div className="items-center space-x">
      <span className="font-mono text-sm text-slate-600 dark:text-slate-300">
        {truncateAddress(address)}
      </span>
      <button onClick={handleCopy} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
        {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4 text-slate-400" />}
      </button>
    </div>;
}