import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  useBalance,
  useOrderHistory,
  usePositions,
} from "../hooks/useTrading";
import { BalanceCard } from "../components/portfolio/BalanceCard";
import { PositionsTable } from "../components/portfolio/PositionsTable";
import { OrderHistoryTable } from "../components/portfolio/OrderHistoryTable";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingState } from "../components/ui/LoadingState";

export function PortfolioPage() {
  const { isAuthenticated, loading } = useAuth();
  const balanceQuery = useBalance(isAuthenticated);
  const positionsQuery = usePositions(isAuthenticated);
  const historyQuery = useOrderHistory(isAuthenticated);

  if (loading) {
    return <LoadingState label="Checking wallet session…" />;
  }

  if (!isAuthenticated) {
    return (
      <div className="page">
        <EmptyState
          title="Sign in to view your portfolio"
          description="Connect Phantom or Solflare from the header to see balances, positions, and order history."
          action={
            <Link to="/" className="text-link">
              Browse markets
            </Link>
          }
        />
      </div>
    );
  }

  const isLoading =
    balanceQuery.isLoading || positionsQuery.isLoading || historyQuery.isLoading;

  if (isLoading) {
    return <LoadingState label="Loading portfolio…" />;
  }

  return (
    <div className="page portfolio-page">
      <section className="page-hero compact">
        <div>
          <p className="eyebrow">Your account</p>
          <h1>Portfolio</h1>
          <p className="lead">Track cash, open positions, and recent activity.</p>
        </div>
      </section>

      <div className="portfolio-grid">
        <BalanceCard balance={balanceQuery.data ?? 0} />
        <PositionsTable positions={positionsQuery.data ?? []} />
        <OrderHistoryTable history={historyQuery.data ?? []} />
      </div>
    </div>
  );
}
