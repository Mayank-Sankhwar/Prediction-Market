import type { Orderbook } from "../../types";
import { getOrderbookRows } from "../../lib/orderbook";
import { Card } from "../ui/Card";

interface OrderbookPanelProps {
  title: string;
  orderbook: Orderbook;
  accent: "yes" | "no";
}

export function OrderbookPanel({ title, orderbook, accent }: OrderbookPanelProps) {
  const rows = getOrderbookRows(orderbook).slice(0, 8);
  const maxQty = Math.max(...rows.map((row) => row.qty), 1);

  return (
    <Card title={title} subtitle="Live depth by price level">
      {rows.length === 0 ? (
        <p className="muted-copy">No open orders on this side.</p>
      ) : (
        <div className="orderbook-table">
          <div className="orderbook-head">
            <span>Price</span>
            <span>Size</span>
          </div>
          {rows.map((row) => (
            <div key={row.price} className="orderbook-row">
              <span className={`orderbook-price orderbook-price-${accent}`}>
                {row.price}¢
              </span>
              <div className="orderbook-size">
                <span
                  className={`orderbook-bar orderbook-bar-${accent}`}
                  style={{ width: `${(row.qty / maxQty) * 100}%` }}
                />
                <span>{row.qty}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
