"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";
import { AiOutlineSearch } from "react-icons/ai";
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
  "5PX34R7hD8zs1fPgNYSosmDkVa2ryRFrXkKGx1C4pump",
  "9yNEs1Z96EF4Y5NTufU9FyRAz6jbGzZLBfRQCtssPtAQ",
  "3KAeVfDbU6tZxSD2kqz3Pz6B6f42CW3FdA89GUZ8fw23",
];

export default function DexCheckerPage() {
  const [tokenAddressInput, setTokenAddressInput] = useState("");
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pairData, setPairData] = useState<PairData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestBoosted, setLatestBoosted] = useState<BoostedToken[]>([]);
  const [trendingTokens, setTrendingTokens] = useState<BoostedToken[]>([]);
  const [isPaid, setIsPaid] = useState(false);

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
    try {
      const response = await fetch("https://api.dexscreener.com/token-boosts/latest/v1");
      const data = await response.json();
      setLatestBoosted(data.slice(0, 5));
    } catch {
      setError("Failed to load boosted tokens.");
    }
  };

  const fetchTokenDetails = async () => {
    try {
      const response = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(tokenAddressInput)}`
      );
      const data = await response.json();
      const matchedPair = data.pairs.find(
        (pair: PairData) => pair.baseToken.address.toLowerCase() === tokenAddressInput.toLowerCase()
      );

      if (!matchedPair) throw new Error("Token not found. Check the address and try again.");

      setTokenData({
        chainId: matchedPair.chainId,
        tokenAddress: tokenAddressInput,
        description: `Pair on ${matchedPair.dexId}`,
        url: matchedPair.url,
        icon: matchedPair.info?.imageUrl || "/default-icon.png",
        symbol: matchedPair.baseToken.symbol,
      });

      setPairData([matchedPair]);
      return matchedPair.chainId;
    } catch (err) {
      setError("Failed to fetch token details.");
      setLoading(false);
      return null;
    }
  };

  const fetchOrderStatus = async (chainId: string) => {
    try {
      const response = await fetch(
        `https://api.dexscreener.com/orders/v1/${chainId}/${encodeURIComponent(tokenAddressInput)}`
      );
      if (!response.ok) throw new Error("Failed to check orders for the token");

      const data = await response.json();
      setOrders(data || []);
      
      // Set `isPaid` to true if any order has "approved" status
      setIsPaid(data.some((order: Order) => order.status === "approved"));
    } catch (err) {
      setError("Failed to fetch payment orders for the token.");
    }
  };

  const checkDexPayment = async () => {
    setLoading(true);
    setError(null);
    setOrders([]);
    setPairData([]);
    setTokenData(null);
    setIsPaid(false);

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

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-4 pt-16">
      <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-r from-purple-700 to-blue-600 opacity-20" />

      <h1 className="text-4xl font-bold mb-8 z-10">DEXScreener Payment Checker</h1>

      <div className="text-gray-400 mb-4 z-10">
        <p>Popular Searches:</p>
        <div className="flex space-x-2 mt-2">
          {popularTokens.map((token) => (
            <button
              key={token}
              onClick={() => {
                setTokenAddressInput(token);
                checkDexPayment();
              }}
              className="bg-gray-700 text-white px-2 py-1 rounded-md hover:bg-gray-600"
            >
              {token.slice(0, 4)}...{token.slice(-4)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8 relative z-10 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter token address"
          value={tokenAddressInput}
          onChange={(e) => setTokenAddressInput(e.target.value)}
          className="w-full px-4 py-2 pr-10 rounded-md text-gray-800 focus:outline-none"
        />
        <button
          onClick={checkDexPayment}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <AiOutlineSearch className="text-black text-2xl" />
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center z-10">
          <PuffLoader color="#36D7B7" size={60} />
        </div>
      )}

      {error && (
        <motion.div
          className="relative p-6 bg-red-800 rounded-lg shadow-md text-center mb-8 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
        >
          <span role="img" aria-label="sad" className="text-4xl mb-2">
            😞
          </span>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Failed to fetch token details</h2>
          <p className="text-gray-200">Please check the token address or try again later.</p>
        </motion.div>
      )}

      {isPaid && tokenData && (
        <motion.div
          className="relative p-6 bg-gray-800 rounded-lg shadow-md text-center mb-8 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.1 }}
        >
          <h2 className="text-3xl font-bold text-green-400 mb-2">Yes, the DEX is paid!</h2>
          <img src={tokenData.icon} alt="Token Icon" className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-bold">{tokenData.symbol}</h3>
          <p className="text-gray-400">Chain ID: {tokenData.chainId.toUpperCase()}</p>
        </motion.div>
      )}

      {!isPaid && tokenData && !loading && (
        <div className="p-6 bg-gray-800 rounded-lg shadow-md text-center mb-8 z-10">
          <h2 className="text-2xl font-bold text-yellow-400">No, the DEX has not paid.</h2>
          <img src={tokenData.icon || "/default-icon.png"} alt="Token Icon" className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-bold">{tokenData.symbol}</h3>
          <p className="text-gray-400">Chain ID: {tokenData.chainId.toUpperCase()}</p>
        </div>
      )}

      <div className="flex justify-between w-full max-w-4xl space-x-4 z-10">
        <section className="bg-gray-900 p-4 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-bold mb-4">Latest Boosted Tokens</h2>
          <button onClick={fetchLatestBoostedTokens} className="text-blue-400 hover:underline flex items-center gap-2">
            <FaSync /> Refresh
          </button>
          {latestBoosted.map((token, index) => (
            <div key={index} className="flex items-center gap-4 mt-4">
              <img src={token.icon || "/default-icon.png"} alt="Token Icon" className="w-10 h-10" />
              <div>
                <p>{token.description}</p>
                <a href={token.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  View
                </a>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-gray-900 p-4 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-bold mb-4">Trending Tokens</h2>
          {trendingTokens.map((token, index) => (
            <div key={index} className="flex items-center gap-4 mt-4">
              <img src={token.icon || "/default-icon.png"} alt="Token Icon" className="w-10 h-10" />
              <div>
                <p>{token.description}</p>
                <a href={token.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  View
                </a>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
