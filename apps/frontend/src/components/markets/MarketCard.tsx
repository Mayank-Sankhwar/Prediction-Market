import { Link } from "react-router-dom";
import type { Market } from "../../types";
import {
  getBestYesPrice,
  getImpliedNoPrice,
  parseOrderbook,
} from "../../lib/orderbook";
import { formatPercent } from "../../lib/format";
import { Badge } from "../ui/Badge";

interface MarketCardProps {
  market: Market;
}

export function MarketCard({ market }: MarketCardProps) {
  const yesOrderbook = parseOrderbook(market.yesOrderbook);
  const noOrderbook = parseOrderbook(market.noOrderbook);
  const yesPrice = getBestYesPrice(yesOrderbook, noOrderbook);
  const noPrice = getImpliedNoPrice(yesPrice);

  return (
    <Link to={`/market/${market.id}`} className="market-card">
      <div className="market-card-top">
        <h3>{market.title}</h3>
        {market.resolution ? (
          <Badge tone={market.resolution === "Yes" ? "yes" : "no"}>
            Resolved {market.resolution}
          </Badge>
        ) : (
          <Badge tone="accent">Open</Badge>
        )}
      </div>
      <p className="market-card-description">{market.description}</p>
      <div className="market-card-prices">
        <div className="price-chip price-chip-yes">
          <span>Yes</span>
          <strong>{yesPrice !== null ? formatPercent(yesPrice) : "—"}</strong>
        </div>
        <div className="price-chip price-chip-no">
          <span>No</span>
          <strong>{noPrice !== null ? formatPercent(noPrice) : "—"}</strong>
        </div>
      </div>
      <div className="market-card-meta">
        <span>{market.totalQty.toLocaleString()} shares outstanding</span>
      </div>
    </Link>
  );
}
