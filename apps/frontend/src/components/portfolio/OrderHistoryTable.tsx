import { Link } from "react-router-dom";
import type { OrderHistoryEntry } from "../../types";
import { formatCents, formatPrice, getOrderQty } from "../../lib/format";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface OrderHistoryTableProps {
  history: OrderHistoryEntry[];
}

function getHistoryTone(orderType: string): "neutral" | "yes" | "no" | "accent" {
  if (orderType === "Buy") return "yes";
  if (orderType === "Sell") return "no";
  return "accent";
}

export function OrderHistoryTable({ history }: OrderHistoryTableProps) {
  const sorted = [...history].sort((a, b) => a.id.localeCompare(b.id)).reverse();

  return (
    <Card title="Order History" subtitle="Recent trading activity">
      {sorted.length === 0 ? (
        <p className="muted-copy">No orders yet.</p>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Market</th>
                <th>Price</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <Badge tone={getHistoryTone(entry.orderType)}>{entry.orderType}</Badge>
                  </td>
                  <td>
                    <Link to={`/market/${entry.marketId}`} className="table-link">
                      {entry.marketId.slice(0, 8)}…
                    </Link>
                  </td>
                  <td>
                    {entry.price > 0 ? formatPrice(entry.price) : formatCents(0)}
                  </td>
                  <td>{getOrderQty(entry).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
