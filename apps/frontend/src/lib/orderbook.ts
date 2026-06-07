import type { Orderbook } from "../types";

export function parseOrderbook(raw: unknown): Orderbook {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Orderbook;
    } catch {
      return {};
    }
  }
  return raw as Orderbook;
}

export interface OrderbookRow {
  price: number;
  qty: number;
}

export function getOrderbookRows(orderbook: Orderbook): OrderbookRow[] {
  return Object.entries(orderbook)
    .map(([price, level]) => ({
      price: Number(price),
      qty: level?.availableQty ?? 0,
    }))
    .filter((row) => row.qty > 0)
    .sort((a, b) => a.price - b.price);
}

export function getBestYesPrice(
  yesOrderbook: Orderbook,
  noOrderbook: Orderbook,
): number | null {
  const yesAsks = getOrderbookRows(yesOrderbook);
  if (yesAsks.length > 0) return yesAsks[0]!.price;

  const noAsks = getOrderbookRows(noOrderbook);
  if (noAsks.length > 0) return 100 - noAsks[0]!.price;

  return null;
}

export function getImpliedNoPrice(yesPrice: number | null): number | null {
  if (yesPrice === null) return null;
  return 100 - yesPrice;
}
