import { useState } from "react";
import type { Position } from "../../types";
import { getApiErrorMessage } from "../../api/client";
import { useMergePosition, useSplitPosition } from "../../hooks/useTrading";
import { useToast } from "../../hooks/useToast";
import { formatCents } from "../../lib/format";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

interface SplitMergePanelProps {
  marketId: string;
  positions: Position[];
  balance: number;
  isAuthenticated: boolean;
}

export function SplitMergePanel({
  marketId,
  positions,
  balance,
  isAuthenticated,
}: SplitMergePanelProps) {
  const { pushToast } = useToast();
  const splitMutation = useSplitPosition();
  const mergeMutation = useMergePosition();
  const [amount, setAmount] = useState("10");

  const yesQty = positions.find((p) => p.type === "Yes")?.qty ?? 0;
  const noQty = positions.find((p) => p.type === "No")?.qty ?? 0;
  const mergeable = Math.min(yesQty, noQty);
  const parsedAmount = Number(amount);

  if (!isAuthenticated) return null;

  const handleSplit = async () => {
    if (!Number.isInteger(parsedAmount) || parsedAmount < 1) {
      pushToast("Amount must be a positive integer.", "error");
      return;
    }
    if (parsedAmount > balance) {
      pushToast("Insufficient balance to split.", "error");
      return;
    }

    try {
      const message = await splitMutation.mutateAsync({ marketId, amount: parsedAmount });
      pushToast(message, "success");
    } catch (error) {
      pushToast(getApiErrorMessage(error), "error");
    }
  };

  const handleMerge = async () => {
    if (!Number.isInteger(parsedAmount) || parsedAmount < 1) {
      pushToast("Amount must be a positive integer.", "error");
      return;
    }
    if (parsedAmount > mergeable) {
      pushToast("Insufficient paired Yes/No shares to merge.", "error");
      return;
    }

    try {
      const message = await mergeMutation.mutateAsync({ marketId, amount: parsedAmount });
      pushToast(message, "success");
    } catch (error) {
      pushToast(getApiErrorMessage(error), "error");
    }
  };

  return (
    <Card
      title="Split & Merge"
      subtitle="Convert USD into paired shares, or redeem pairs back to USD"
    >
      <Input
        label="Amount (shares / cents)"
        type="number"
        min={1}
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        hint={`Balance ${formatCents(balance)} · Mergeable ${mergeable}`}
      />

      <div className="split-merge-actions">
        <Button
          variant="secondary"
          loading={splitMutation.isPending}
          onClick={handleSplit}
        >
          Split USD → Yes + No
        </Button>
        <Button
          variant="ghost"
          loading={mergeMutation.isPending}
          onClick={handleMerge}
        >
          Merge Yes + No → USD
        </Button>
      </div>
    </Card>
  );
}
