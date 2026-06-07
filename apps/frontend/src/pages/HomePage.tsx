import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMarkets } from "../hooks/useTrading";
import { MarketCard } from "../components/markets/MarketCard";
import { LoadingState } from "../components/ui/LoadingState";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { fetchMarket } from "../api/markets";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../hooks/useToast";
import { getApiErrorMessage } from "../api/client";

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const marketsQuery = useMarkets(isAuthenticated);
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const [marketIdInput, setMarketIdInput] = useState("");
  const [lookingUp, setLookingUp] = useState(false);

  const handleLookup = async () => {
    const trimmed = marketIdInput.trim();
    if (!trimmed) return;

    setLookingUp(true);
    try {
      const market = await fetchMarket(trimmed);
      if (!market) {
        pushToast("Market not found.", "error");
        return;
      }
      queryClient.setQueryData(["market", trimmed], market);
      queryClient.setQueryData(
        ["markets", isAuthenticated],
        (current: typeof marketsQuery.data) => {
          const existing = current ?? [];
          if (existing.some((item) => item.id === market.id)) return existing;
          return [market, ...existing];
        },
      );
      setMarketIdInput("");
      pushToast(`Added "${market.title}"`, "success");
    } catch (error) {
      pushToast(getApiErrorMessage(error), "error");
    } finally {
      setLookingUp(false);
    }
  };

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Live prediction markets</p>
          <h1>Trade the outcomes that matter</h1>
          <p className="lead">
            Buy and sell Yes/No shares on real-world events. Prices move with
            supply and demand — your conviction, priced in cents.
          </p>
        </div>
      </section>

      <section className="lookup-panel">
        <label className="lookup-field" htmlFor="market-id">
          <span>Have a market ID?</span>
          <div className="lookup-row">
            <input
              id="market-id"
              placeholder="Paste market UUID"
              value={marketIdInput}
              onChange={(event) => setMarketIdInput(event.target.value)}
            />
            <Button loading={lookingUp} onClick={handleLookup}>
              Load market
            </Button>
          </div>
        </label>
      </section>

      {marketsQuery.isLoading ? <LoadingState label="Loading markets…" /> : null}

      {marketsQuery.isError ? (
        <EmptyState
          title="Could not load markets"
          description="Check that the backend is running on port 3000."
        />
      ) : null}

      {!marketsQuery.isLoading && (marketsQuery.data?.length ?? 0) === 0 ? (
        <EmptyState
          title="No markets yet"
          description={
            isAuthenticated
              ? "Load a market by ID above, or trade on a market you've visited before."
              : "Sign in and load a market by ID, or connect after seeding sample markets."
          }
        />
      ) : null}

      {marketsQuery.data && marketsQuery.data.length > 0 ? (
        <section className="market-grid">
          {marketsQuery.data.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </section>
      ) : null}
    </div>
  );
}
