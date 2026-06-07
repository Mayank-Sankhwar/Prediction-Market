import { api } from "./client";
import type {
  OrderHistoryEntry,
  PlaceOrderPayload,
  Position,
  SplitMergePayload,
} from "../types";

export async function fetchBalance(): Promise<number> {
  const { data } = await api.get<{ balance: number }>("/balance");
  return data.balance ?? 0;
}

export async function fetchPositions(): Promise<Position[]> {
  const { data } = await api.get<{ positions: Position[] }>("/positions");
  return data.positions ?? [];
}

export async function fetchOrderHistory(): Promise<OrderHistoryEntry[]> {
  const { data } = await api.post<{ history: OrderHistoryEntry[] }>("/history");
  return data.history ?? [];
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<string> {
  const { data } = await api.post<{ message: string }>("/order", payload);
  return data.message;
}

export async function splitPosition(payload: SplitMergePayload): Promise<string> {
  const { data } = await api.post<{ message: string }>("/split", payload);
  return data.message;
}

export async function mergePosition(payload: SplitMergePayload): Promise<string> {
  const { data } = await api.post<{ message: string }>("/merge", payload);
  return data.message;
}
