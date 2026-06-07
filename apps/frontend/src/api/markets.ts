import { api } from "./client";
import type { Market, OrderHistoryEntry, Position } from "../types";

export async function fetchMarkets(): Promise<Market[]> {
  try {
    const { data } = await api.get<{ markets: Market[] }>("/markets");
    return data.markets ?? [];
  } catch {
    return [];
  }
}

export async function fetchMarket(marketId: string): Promise<Market | null> {
  const { data } = await api.get<{ market: Market | null }>("/market", {
    params: { marketId },
  });
  return data.market;
}

export async function discoverMarketsFromUserData(): Promise<Market[]> {
  const [positionsRes, historyRes] = await Promise.allSettled([
    api.get<{ positions: Position[] }>("/positions"),
    api.post<{ history: OrderHistoryEntry[] }>("/history"),
  ]);

  const marketIds = new Set<string>();

  if (positionsRes.status === "fulfilled") {
    for (const position of positionsRes.value.data.positions ?? []) {
      marketIds.add(position.marketId);
    }
  }

  if (historyRes.status === "fulfilled") {
    for (const entry of historyRes.value.data.history ?? []) {
      marketIds.add(entry.marketId);
    }
  }

  const seedIds = (import.meta.env.VITE_SEED_MARKET_IDS ?? "")
    .split(",")
    .map((id: string) => id.trim())
    .filter(Boolean);

  for (const id of seedIds) {
    marketIds.add(id);
  }

  const markets = await Promise.all(
    [...marketIds].map((id) => fetchMarket(id)),
  );

  return markets.filter((market): market is Market => market !== null);
}

export async function fetchAllMarkets(isAuthenticated: boolean): Promise<Market[]> {
  const listed = await fetchMarkets();
  if (listed.length > 0) return listed;
  if (!isAuthenticated) return [];
  return discoverMarketsFromUserData();
}
