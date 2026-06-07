import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllMarkets, fetchMarket } from "../api/markets";
import {
  fetchBalance,
  fetchOrderHistory,
  fetchPositions,
  mergePosition,
  placeOrder,
  splitPosition,
} from "../api/user";
import type { PlaceOrderPayload, SplitMergePayload } from "../types";

export function useMarkets(isAuthenticated: boolean) {
  return useQuery({
    queryKey: ["markets", isAuthenticated],
    queryFn: () => fetchAllMarkets(isAuthenticated),
    staleTime: 15_000,
  });
}

export function useMarket(marketId: string | undefined) {
  return useQuery({
    queryKey: ["market", marketId],
    queryFn: () => fetchMarket(marketId!),
    enabled: Boolean(marketId),
    refetchInterval: 10_000,
  });
}

export function useBalance(enabled: boolean) {
  return useQuery({
    queryKey: ["balance"],
    queryFn: fetchBalance,
    enabled,
    refetchInterval: 15_000,
  });
}

export function usePositions(enabled: boolean) {
  return useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
    enabled,
    refetchInterval: 15_000,
  });
}

export function useOrderHistory(enabled: boolean) {
  return useQuery({
    queryKey: ["history"],
    queryFn: fetchOrderHistory,
    enabled,
  });
}

function invalidateTradingQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["balance"] });
  queryClient.invalidateQueries({ queryKey: ["positions"] });
  queryClient.invalidateQueries({ queryKey: ["history"] });
  queryClient.invalidateQueries({ queryKey: ["markets"] });
  queryClient.invalidateQueries({ queryKey: ["market"] });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlaceOrderPayload) => placeOrder(payload),
    onSuccess: () => invalidateTradingQueries(queryClient),
  });
}

export function useSplitPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SplitMergePayload) => splitPosition(payload),
    onSuccess: () => invalidateTradingQueries(queryClient),
  });
}

export function useMergePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SplitMergePayload) => mergePosition(payload),
    onSuccess: () => invalidateTradingQueries(queryClient),
  });
}
