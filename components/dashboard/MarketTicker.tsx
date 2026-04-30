"use client";
import { motion } from "framer-motion";
import { MOCK_TRANSACTIONS } from "@/lib/data/marketData";

export default function MarketTicker() {
  return (
    <div className="w-full bg-fe-bg border-y border-fe-border overflow-hidden py-2 flex items-center">
      <div className="bg-brand-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider mr-4 shrink-0 rounded-r">
        CANLI AKIŞ
      </div>
      <motion.div
        className="flex whitespace-nowrap gap-12"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
      >
        {[...MOCK_TRANSACTIONS, ...MOCK_TRANSACTIONS].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-mono text-fe-muted">
            <span className="text-white font-bold">{item.city} ({item.district})</span>
            <span className="text-brand-500">↗ {item.m2}m²</span>
            <span className="text-fe-muted">| {item.brand}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
