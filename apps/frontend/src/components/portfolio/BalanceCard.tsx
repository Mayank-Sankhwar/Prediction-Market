import { formatCents } from "../../lib/format";
import { Card } from "../ui/Card";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <Card title="Cash Balance" subtitle="Available USD for trading">
      <p className="balance-display">{formatCents(balance)}</p>
    </Card>
  );
}
