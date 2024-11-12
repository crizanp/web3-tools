"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";
import { AiOutlineSearch, AiOutlineWarning, AiOutlineSmile, AiOutlineFrown } from "react-icons/ai";
import { FaSync } from "react-icons/fa";

interface TokenData {
  chainId: string;
  tokenAddress: string;
  description?: string;
  url?: string;
  icon?: string;
  symbol?: string;
}

interface Order {
  type: string;
  status: string;
  paymentTimestamp: number;
}

interface PairData {
  chainId: string;
  dexId: string;
  url: string;
  baseToken: {
    address: any;
    name: string;
    symbol: string;
  };
  quoteToken: { name: string; symbol: string };
  priceUsd: string;
  liquidity: { usd: number };
  info?: {
    imageUrl?: string;
  };
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  priceChange: {
    m5: number;
    h1: number;
    h24: number;
  };
}

interface BoostedToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon: string;
  description: string;
  name: string;
  links: { label: string; url: string }[];
}

const popularTokens = [
  "ECZxKmKGEkyKhYUau7WkUE1L9Jp2yLebwX4SnKc1pump",
  "9yNEs1Z96EF4Y5NTufU9FyRAz6jbGzZLBfRQCtssPtAQ",
  "3KAeVfDbU6tZxSD2kqz3Pz6B6f42CW3FdA89GUZ8fw23",
];

export default function DexCheckerPage() {
  const [tokenAddressInput, setTokenAddressInput] = useState("");
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [pairData, setPairData] = useState<PairData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestBoosted, setLatestBoosted] = useState<BoostedToken[]>([]);
  const [trendingTokens, setTrendingTokens] = useState<BoostedToken[]>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [noTokenInfo, setNoTokenInfo] = useState(false);
  const [iconError, setIconError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false); // State to track if refreshing

  useEffect(() => {
    fetchTrendingTokens();
    fetchLatestBoostedTokens();
  }, []);

  const fetchTrendingTokens = async () => {
    try {
      const response = await fetch("https://api.dexscreener.com/token-boosts/top/v1");
      const data = await response.json();
      setTrendingTokens(data.slice(0, 5));
    } catch {
      setError("Failed to load trending tokens.");
    }
  };

  const fetchLatestBoostedTokens = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("https://api.dexscreener.com/token-boosts/latest/v1");
      const data = await response.json();
      setLatestBoosted(data.slice(0, 5));
    } catch {
      setError("Failed to load boosted tokens.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchTokenDetails = async () => {
    try {
      setNoTokenInfo(false);
      setIconError(false);

      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(tokenAddressInput)}`
      );
      const data = await response.json();

      const matchedPair = data.pairs?.find(
        (pair: PairData) => pair.baseToken.address.toLowerCase() === tokenAddressInput.toLowerCase()
      );

      if (matchedPair) {
        setTokenData({
          chainId: matchedPair.chainId,
          tokenAddress: tokenAddressInput,
          description: `Pair on ${matchedPair.dexId}`,
          url: matchedPair.url,
          icon: matchedPair.info?.imageUrl || "", // Empty if no icon is available
          symbol: matchedPair.baseToken.symbol,
        });
        setPairData([matchedPair]);
        return matchedPair.chainId;
      }

      if (tokenAddressInput.toLowerCase().endsWith("pump")) {
        setTokenData({
          chainId: "solana",
          tokenAddress: tokenAddressInput,
          description: "Solana Token (Pump Suffix)",
          url: "",
          icon: "", // Empty if no icon is available
        });
        setPairData([]);
        return "solana";
      }

      setNoTokenInfo(true);
      throw new Error("Token not found. Check the address and try again.");
    } catch (err) {
      setError("Failed to fetch token details.");
      setLoading(false);
      return null;
    }
  };

  const checkDexPayment = async () => {
    setLoading(true);
    setError(null);
    setPairData([]);
    setTokenData(null);
    setIsPaid(false);
    setNoTokenInfo(false);
    setIconError(false);

    try {
      const chainId = await fetchTokenDetails();
      if (chainId) {
        await fetchOrderStatus(chainId);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStatus = async (chainId: string) => {
    try {
      const endpoint =
        chainId === "solana"
          ? `https://api.dexscreener.com/orders/v1/solana/${encodeURIComponent(tokenAddressInput)}`
          : `https://api.dexscreener.com/orders/v1/${chainId}/${encodeURIComponent(tokenAddressInput)}`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to check orders for the token");

      const data = await response.json();
      setIsPaid(data.some((order: Order) => order.status === "approved"));
    } catch (err) {
      setError("Failed to fetch payment orders for the token.");
    }
  };

  const handlePopularSearchClick = (token: string) => {
    setTokenAddressInput(token);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      checkDexPayment();
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 space-y-8">
      <div className="max-w-lg w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">DEX Screener Paid Checker</h1>

        <div className="bg-gray-700 rounded-full flex items-center px-4 py-2 space-x-4">
          <input
            type="text"
            placeholder="Enter token address"
            value={tokenAddressInput}
            onChange={(e) => setTokenAddressInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-transparent outline-none text-white placeholder-gray-300 flex-grow"
          />
          <button onClick={checkDexPayment}>
            <AiOutlineSearch className="text-2xl text-white" />
          </button>
        </div>
        
        <div className="text-center mt-4 text-gray-400">
          <p>Popular Searches:</p>
          <div className="flex justify-center space-x-2 mt-2">
            {popularTokens.map((token) => (
              <button
                key={token}
                onClick={() => handlePopularSearchClick(token)}
                className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md hover:bg-gray-700"
              >
                {token.slice(0, 4)}...{token.slice(-4)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center">
          <PuffLoader color="#36D7B7" size={60} />
        </div>
      )}

      {error && (
        <motion.div
          className="bg-red-600 p-6 rounded-lg text-center w-full max-w-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xl">Failed to fetch token details. Please check and try again.</p>
        </motion.div>
      )}

      {tokenData && (
        <motion.div
          className="bg-gray-800 p-6 rounded-lg text-center w-full max-w-md flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-bold mb-4">
            {isPaid ? "Yes, the DEX is paid!" : "No, the DEX has not paid."}
          </h2>
          
          {tokenData.icon ? (
            <img
              src={tokenData.icon}
              alt="Token Icon"
              className="w-12 h-12 mx-auto"
              onError={() => setIconError(true)}
            />
          ) : isPaid ? (
            <AiOutlineSmile className="text-5xl text-green-500 mt-4" />
          ) : (
            <AiOutlineFrown className="text-5xl text-red-500 mt-4" />
          )}

          <p className="text-sm text-gray-500 mt-2">Chain ID: {tokenData.chainId.toUpperCase()}</p>
          {tokenData.symbol && (
            <p className="text-sm text-gray-500">Symbol: {tokenData.symbol}</p>
          )}

          {pairData.length > 0 && (
            <div className="mt-4 text-left w-full">
              <h3 className="font-semibold">Pair Information:</h3>
              <p><span className="font-semibold">Liquidity (USD):</span> ${pairData[0].liquidity.usd.toFixed(2)}</p>
              <p><span className="font-semibold">Price (USD):</span> ${pairData[0].priceUsd}</p>

              <div className="mt-4">
                <h3 className="font-semibold">Transactions:</h3>
                <p>5 Min - Buys: {pairData[0].txns.m5.buys}, Sells: {pairData[0].txns.m5.sells}</p>
                <p>1 Hour - Buys: {pairData[0].txns.h1.buys}, Sells: {pairData[0].txns.h1.sells}</p>
                <p>24 Hours - Buys: {pairData[0].txns.h24.buys}, Sells: {pairData[0].txns.h24.sells}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <section className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Latest Boosted Tokens</h2>
          <button
            onClick={fetchLatestBoostedTokens}
            className={`text-blue-400 hover:underline flex items-center gap-2 mb-4 ${
              isRefreshing ? "rotate" : ""
            }`}
          >
            <FaSync className={isRefreshing ? "animate-spin" : ""} /> Refresh
          </button>
          {latestBoosted.map((token, index) => (
            <div key={index} className="flex items-center gap-4 mt-4">
              <img src={token.icon || ""} alt="Token Icon" className="w-10 h-10" />
              <div className="truncate w-full">
                <p>{token.description?.length > 50 ? `${token.description.slice(0, 50)}...` : token.description || token.tokenAddress }</p>
                <a href={token.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  View
                </a>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Trending Tokens</h2>
          {trendingTokens.map((token, index) => (
            <div key={index} className="flex items-center gap-4 mt-4">
              <img src={token.icon || "/default-icon.png"} alt="Token Icon" className="w-10 h-10" />
              <div className="truncate w-full">
                <p>{token.description.length > 50 ? `${token.description.slice(0, 50)}...` : token.description}</p>
                <a href={token.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  View
                </a>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Inline CSS for animation */}
      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
