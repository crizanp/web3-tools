"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";
import { AiOutlineSearch, AiOutlineWarning, AiOutlineSmile, AiOutlineFrown } from "react-icons/ai";
import { FaSync } from "react-icons/fa";
import Advertisement from "./components/Advertisement";
import Footer from "./components/Footer_IGH";

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
  "GJAFwWjJ3vnTsrQVabjBVK2TYB1YtRCQXRDfDgUnpump",
  "ECZxKmKGEkyKhYUau7WkUE1L9Jp2yLebwX4SnKc1pump",
  "3KAeVfDbU6tZxSD2kqz3Pz6B6f42CW3FdA89GUZ8fw23",
  "72XUGRRzuSoLRch3QPpSPHkuZ8F58rvtCNF4QSosLb4H",
];

export default function DexCheckerPage() {
  const [tokenAddressInput, setTokenAddressInput] = useState("");
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [pairData, setPairData] = useState<PairData[]>([]);
  const [latestBoosted, setLatestBoosted] = useState<BoostedToken[]>([]);
  const [trendingTokens, setTrendingTokens] = useState<BoostedToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [noTokenInfo, setNoTokenInfo] = useState(false);
  const [iconError, setIconError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTrendingTokens();
    fetchLatestBoostedTokens();
  }, []);

  const fetchTrendingTokens = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_TT_API!);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTrendingTokens(data.slice(0, 5));
      } else {
        setError("Unexpected data format for trending tokens.");
      }
    } catch {
      setError("Failed to load trending tokens.");
    }
  };

  const fetchLatestBoostedTokens = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LB_API!);
      const data = await response.json();
      if (Array.isArray(data)) {
        setLatestBoosted(data.slice(0, 5));
      } else {
        setError("Unexpected data format for boosted tokens.");
      }
    } catch {
      setError("Failed to load boosted tokens.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchTokenDetails = async (tokenAddress: string) => {
    try {
      setNoTokenInfo(false);
      setIconError(false);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TD_API}${encodeURIComponent(tokenAddress)}`
      );
      const data = await response.json();

      if (data && Array.isArray(data.pairs)) {
        const matchedPair = data.pairs.find(
          (pair: PairData) => pair.baseToken.address.toLowerCase() === tokenAddress.toLowerCase()
        );

        if (matchedPair) {
          setTokenData({
            chainId: matchedPair.chainId,
            tokenAddress,
            description: `Pair on ${matchedPair.dexId}`,
            url: matchedPair.url,
            icon: matchedPair.info?.imageUrl || "",
            symbol: matchedPair.baseToken.symbol,
          });
          setPairData([matchedPair]);
          return matchedPair.chainId;
        }
      }

      const inferredChainId = inferChainIdFromAddress(tokenAddress);
      if (inferredChainId) {
        setTokenData({
          chainId: inferredChainId,
          tokenAddress,
          description: "Inferred Chain",
          url: "",
          icon: "",
        });
        return inferredChainId;
      }

      setNoTokenInfo(true);
      throw new Error("Token not found. Check the address and try again.");
    } catch (err) {
      setError("Failed to fetch token details.");
      setLoading(false);
      return null;
    }
  };

  const inferChainIdFromAddress = (address: string) => {
    if (address.startsWith("0x")) {
      return "ethereum";
    } else if (address.match(/^[1-9A-HJ-NP-Za-km-z]+$/)) {
      return "solana";
    } else if (address.startsWith("bnb")) {
      return "bsc";
    }
    return null;
  };

  const fetchOrderStatus = async (tokenAddress: string, chainId: string) => {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_OS_API}/${chainId}/${encodeURIComponent(tokenAddress)}`;

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Failed to check orders for the token");

      const data = await response.json();
      setIsPaid(data.some((order: Order) => order.status === "approved"));
    } catch (err) {
      setError("Failed to fetch payment orders for the token.");
    }
  };

  const checkDexPayment = async (tokenAddress: string) => {
    setLoading(true);
    setError(null);
    setPairData([]);
    setTokenData(null);
    setIsPaid(false);
    setNoTokenInfo(false);
    setIconError(false);
    setHasSearched(true);

    try {
      const chainId = await fetchTokenDetails(tokenAddress);
      if (chainId) {
        await fetchOrderStatus(tokenAddress, chainId);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      if (outputRef.current) {
        outputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handlePopularSearchClick = (token: string) => {
    setTokenAddressInput(token);
    checkDexPayment(token);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      checkDexPayment(tokenAddressInput);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 space-y-8">
      <div className="w-full md:w-4/4 lg:w-3/4">
        <Advertisement />
      </div>

      <div className="w-full md:w-4/4 lg:w-3/4 p-4 md:p-6 bg-gray-700 rounded-lg shadow-lg">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 md:mb-6">DEX Screener Paid Checker</h1>

        <div className="flex flex-col items-center bg-gray-800 p-3 md:p-4 rounded-lg space-y-3">
          {/* Search Bar with responsive padding and size */}
          <div className="flex items-center bg-gray-700 rounded-full px-3 py-2 md:px-4 md:py-3 w-full">
            <input
              type="text"
              placeholder="Enter token address"
              value={tokenAddressInput}
              onChange={(e) => setTokenAddressInput(e.target.value)}
              onKeyPress={(event) => event.key === "Enter" && checkDexPayment(tokenAddressInput)}
              className="bg-transparent outline-none text-white placeholder-gray-300 flex-grow text-sm md:text-lg"
            />
            <button onClick={() => checkDexPayment(tokenAddressInput)}>
              <AiOutlineSearch className="text-2xl md:text-3xl text-white" />
            </button>
          </div>

          {/* Centered Popular Searches */}
          <div className="text-center text-gray-400 text-sm md:text-base mt-2 w-full px-2">
            <p>Popular Searches:</p>
            <div className="flex justify-start md:justify-center overflow-x-auto no-scrollbar space-x-2 mt-2 w-full px-2">
              {popularTokens.map((token) => (
                <button
                  key={token}
                  onClick={() => handlePopularSearchClick(token)}
                  className="bg-gray-600 text-gray-300 px-2 py-1 md:px-3 md:py-2 rounded-md hover:bg-gray-500 flex-shrink-0 whitespace-nowrap"
                >
                  {token.slice(0, 4)}...{token.slice(-4)}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center">
          <PuffLoader color="#36D7B7" size={60} />
        </div>
      )}

      <div ref={outputRef}>
        {!loading && hasSearched && (
          <motion.div
            className={`p-6 rounded-lg text-center w-full max-w-md border-4 ${isPaid ? "border-green-500" : "border-red-500"
              }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold mb-4">
              {isPaid ? "Yes, the DEX is paid!" : "No, the DEX has not paid."}
            </h2>
            {tokenData?.icon ? (
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
            <p className="text-sm text-gray-500 mt-2">Chain ID: {tokenData?.chainId.toUpperCase()}</p>
            {tokenData?.symbol && <p className="text-sm text-gray-500">Symbol: {tokenData.symbol}</p>}
            {pairData?.length > 0 && (
              <div className="mt-4 text-left w-full">
                <h3 className="font-semibold">Pair Information:</h3>
                <p>
                  <span className="font-semibold">Liquidity (USD):</span> $
                  {pairData[0]?.liquidity?.usd ? pairData[0].liquidity.usd.toFixed(2) : "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Price (USD):</span> $
                  {pairData[0]?.priceUsd ? parseFloat(pairData[0].priceUsd).toFixed(9) : "N/A"}
                </p>
                <div className="mt-4">
                  <h3 className="font-semibold">Transactions:</h3>
                  <p>5 Min - Buys: {pairData[0]?.txns?.m5?.buys ?? "N/A"}, Sells: {pairData[0]?.txns?.m5?.sells ?? "N/A"}</p>
                  <p>1 Hour - Buys: {pairData[0]?.txns?.h1?.buys ?? "N/A"}, Sells: {pairData[0]?.txns?.h1?.sells ?? "N/A"}</p>
                  <p>24 Hours - Buys: {pairData[0]?.txns?.h24?.buys ?? "N/A"}, Sells: {pairData[0]?.txns?.h24?.sells ?? "N/A"}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <section className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Latest Boosted Tokens</h2>
          <button
            onClick={fetchLatestBoostedTokens}
            className={`text-blue-400 hover:underline flex items-center gap-2 mb-4 ${isRefreshing ? "rotate" : ""}`}
          >
            <FaSync className={isRefreshing ? "animate-spin" : ""} /> Refresh
          </button>
          {latestBoosted?.length > 0 ? (
            latestBoosted.map((token, index) => (
              <div key={index} className="flex items-center gap-4 mt-4">
                <img src={token.icon || ""} alt="Token Icon" className="w-10 h-10" />
                <div className="truncate w-full">
                  <p>{token.description?.length > 50 ? `${token.description.slice(0, 50)}...` : token.description}</p>
                  <a href={token.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    View
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No boosted tokens available.</p>
          )}
        </section>

        <section className="bg-gray-900 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Trending Tokens</h2>
          {trendingTokens?.length > 0 ? (
            trendingTokens.map((token, index) => (
              <div key={index} className="flex items-center gap-4 mt-4">
                <img src={token.icon || "/default-icon.png"} alt="Token Icon" className="w-10 h-10" />
                <div className="truncate w-full">
                  <p>{token.description?.length > 50 ? `${token.description.slice(0, 50)}...` : token.description}</p>
                  <a href={token.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    View
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No trending tokens available.</p>
          )}
        </section>
      </div>
      <Footer />
    </main>
  );
}