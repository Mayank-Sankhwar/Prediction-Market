import type { Position } from "../../types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Link } from "react-router-dom";

interface PositionsTableProps {
  positions: Position[];
}

export function PositionsTable({ positions }: PositionsTableProps) {
  return (
    <Card title="Open Positions" subtitle="Your outcome shares across markets">
      {positions.length === 0 ? (
        <p className="muted-copy">No open positions yet. Trade or split to get started.</p>
      ) : (
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Market</th>
                <th>Side</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <tr key={position.id}>
                  <td>
                    <Link to={`/market/${position.marketId}`} className="table-link">
                      {position.marketId.slice(0, 8)}…
                    </Link>
                  </td>
                  <td>
                    <Badge tone={position.type === "Yes" ? "yes" : "no"}>
                      {position.type}
                    </Badge>
                  </td>
                  <td>{position.qty.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
