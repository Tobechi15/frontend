import { useState } from "react";
import { Clipboard } from "lucide-react";

type CopyButtonProps = {
  text: string;
};

export const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const abbreviate = (str: string): string => {
    return str.length > 10 ? `${str.slice(0, 6)}...${str.slice(-4)}` : str;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="flex items-center text-slate-400 text-sm ml-2 cursor-pointer" onClick={handleCopy}>
      {abbreviate(text)}
      <Clipboard className="w-4 h-4 ml-1 text-gray-500 hover:text-gray-300" />
      {copied && <span className="ml-2 text-green-500 text-xs">Copied!</span>}
    </span>
  );
};
