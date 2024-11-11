"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PuffLoader from "react-spinners/PuffLoader";

interface TokenData {
  chainId: string;
  tokenAddress: string;
  description?: string;
  url?: string;
  icon?: string;
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
    address: any; name: string; symbol: string 
};
  quoteToken: { name: string; symbol: string };
  priceUsd: string;
  liquidity: { usd: number };
}

export default function DexCheckerPage() {
  const [tokenAddressInput, setTokenAddressInput] = useState("");
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pairData, setPairData] = useState<PairData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Step 1: Fetch token details from /latest/dex/tokens/{tokenAddresses}
  const fetchTokenDetails = async () => {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(tokenAddressInput)}`);
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
        icon: matchedPair.info?.imageUrl,
      });

      setPairData([matchedPair]);

      // Return chainId to use it in the next step
      return matchedPair.chainId;
    } catch (err) {
      setError("Failed to fetch token details.");
      setLoading(false);
      return null;
    }
  };

  // Step 2: Fetch payment information (boost status) from /orders/v1/{chainId}/{tokenAddress}
  const fetchOrderStatus = async (chainId: string) => {
    try {
      const response = await fetch(
        `https://api.dexscreener.com/orders/v1/${chainId}/${encodeURIComponent(tokenAddressInput)}`
      );
      if (!response.ok) throw new Error("Failed to check orders for the token");

      const data = await response.json();
      setOrders(data || []);
    } catch (err) {
      setError("Failed to fetch payment orders for the token.");
    }
  };

  // Main function to check DEX payment status and boosts
  const checkDexPayment = async () => {
    setLoading(true);
    setError(null);
    setOrders([]);
    setPairData([]);
    setTokenData(null);

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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">DEX Payment Checker</h1>

      {/* Input Field */}
      <div className="mb-8 flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter token address"
          value={tokenAddressInput}
          onChange={(e) => setTokenAddressInput(e.target.value)}
          className="px-4 py-2 rounded-md text-gray-800"
        />
        <button
          onClick={checkDexPayment}
          className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-700"
        >
          Check DEX Payment
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex items-center justify-center">
          <PuffLoader color="#36D7B7" size={60} />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Display Token Information */}
      {tokenData && (
        <section className="p-4 bg-gray-800 rounded-lg shadow-md text-center mb-8">
          {tokenData.icon && <img src={tokenData.icon} alt="Token Icon" className="w-16 h-16 mx-auto mb-4" />}
          <h2 className="text-2xl font-bold">{tokenData.chainId.toUpperCase()}</h2>
          <p className="text-gray-400">{tokenData.description}</p>
          <a
            href={tokenData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            View Token Profile
          </a>
        </section>
      )}

      {/* Orders Display */}
      {orders.length > 0 && (
        <motion.div
          className="p-4 bg-gray-800 rounded-lg shadow-md text-center mb-8"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-2xl font-semibold mb-4">DEX Payment Status</h2>
          {orders.map((order, index) => (
            <div key={index} className="mb-2">
              <p className="text-lg">Type: {order.type}</p>
              <p
                className={`text-lg font-bold ${
                  order.status === "approved" ? "text-green-400" : "text-yellow-400"
                }`}
              >
                Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </p>
              <p className="text-sm text-gray-400">
                Payment Time: {new Date(order.paymentTimestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Display Pair Data */}
      {pairData.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
          {pairData.map((pair, index) => (
            <motion.div
              key={index}
              className="p-4 bg-gray-800 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-lg font-bold">
                {pair.baseToken.symbol}/{pair.quoteToken.symbol}
              </h3>
              <p className="text-gray-300">Price: ${parseFloat(pair.priceUsd).toFixed(4)}</p>
              <p className="text-gray-300">Liquidity: ${pair.liquidity.usd.toLocaleString()}</p>
              <a
                href={pair.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                View Pair
              </a>
            </motion.div>
          ))}
        </section>
      )}
    </main>
  );
}
