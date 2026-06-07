import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useBalance,
  useMarket,
  usePositions,
} from "../hooks/useTrading";
import { parseOrderbook, getBestYesPrice, getImpliedNoPrice } from "../lib/orderbook";
import { formatPercent } from "../lib/format";
import { OrderbookPanel } from "../components/markets/OrderbookPanel";
import { TradePanel } from "../components/markets/TradePanel";
import { SplitMergePanel } from "../components/markets/SplitMergePanel";
import { LoadingState } from "../components/ui/LoadingState";
import { EmptyState } from "../components/ui/EmptyState";
import { Badge } from "../components/ui/Badge";

export function MarketPage() {
  const { marketId } = useParams<{ marketId: string }>();
  const { isAuthenticated } = useAuth();
  const marketQuery = useMarket(marketId);
  const balanceQuery = useBalance(isAuthenticated);
  const positionsQuery = usePositions(isAuthenticated);

  if (marketQuery.isLoading) {
    return <LoadingState label="Loading market…" />;
  }

  if (!marketQuery.data) {
    return (
      <div className="page">
        <EmptyState
          title="Market not found"
          description="This market ID does not exist or could not be loaded."
          action={
            <Link to="/" className="text-link">
              Back to markets
            </Link>
          }
        />
      </div>
    );
  }

  const market = marketQuery.data;
  const yesOrderbook = parseOrderbook(market.yesOrderbook);
  const noOrderbook = parseOrderbook(market.noOrderbook);
  const yesPrice = getBestYesPrice(yesOrderbook, noOrderbook);
  const noPrice = getImpliedNoPrice(yesPrice);
  const marketPositions =
    positionsQuery.data?.filter((position) => position.marketId === market.id) ?? [];

  return (
    <div className="page market-page">
      <section className="market-hero">
        <div>
          <Link to="/" className="breadcrumb">
            ← All markets
          </Link>
          <div className="market-hero-title">
            <h1>{market.title}</h1>
            {market.resolution ? (
              <Badge tone={market.resolution === "Yes" ? "yes" : "no"}>
                Resolved {market.resolution}
              </Badge>
            ) : (
              <Badge tone="accent">Open</Badge>
            )}
          </div>
          <p className="lead">{market.description}</p>
          <p className="muted-copy">
            <strong>Resolution criteria:</strong> {market.resolutionDescription}
          </p>
        </div>

        <div className="probability-panel">
          <div className="probability-card yes">
            <span>Yes</span>
            <strong>{yesPrice !== null ? formatPercent(yesPrice) : "—"}</strong>
          </div>
          <div className="probability-card no">
            <span>No</span>
            <strong>{noPrice !== null ? formatPercent(noPrice) : "—"}</strong>
          </div>
        </div>
      </section>

      <div className="market-layout">
        <div className="market-main">
          <OrderbookPanel title="Yes order book" orderbook={yesOrderbook} accent="yes" />
          <OrderbookPanel title="No order book" orderbook={noOrderbook} accent="no" />
        </div>

        <aside className="market-sidebar">
          <TradePanel
            marketId={market.id}
            positions={marketPositions}
            balance={balanceQuery.data ?? 0}
            isAuthenticated={isAuthenticated}
          />
          <SplitMergePanel
            marketId={market.id}
            positions={marketPositions}
            balance={balanceQuery.data ?? 0}
            isAuthenticated={isAuthenticated}
          />
        </aside>
      </div>
    </div>
  );
}
