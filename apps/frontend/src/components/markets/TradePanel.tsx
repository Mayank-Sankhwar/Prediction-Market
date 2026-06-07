import { useMemo, useState } from "react";
import type { Position } from "../../types";
import { getApiErrorMessage } from "../../api/client";
import { usePlaceOrder } from "../../hooks/useTrading";
import { useToast } from "../../hooks/useToast";
import { formatCents } from "../../lib/format";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

interface TradePanelProps {
  marketId: string;
  positions: Position[];
  balance: number;
  isAuthenticated: boolean;
}

type Side = "yes" | "no";
type OrderType = "buy" | "sell";

export function TradePanel({
  marketId,
  positions,
  balance,
  isAuthenticated,
}: TradePanelProps) {
  const { pushToast } = useToast();
  const placeOrderMutation = usePlaceOrder();

  const [side, setSide] = useState<Side>("yes");
  const [orderType, setOrderType] = useState<OrderType>("buy");
  const [price, setPrice] = useState("50");
  const [qty, setQty] = useState("10");

  const yesQty = positions.find((p) => p.type === "Yes")?.qty ?? 0;
  const noQty = positions.find((p) => p.type === "No")?.qty ?? 0;
  const positionQty = side === "yes" ? yesQty : noQty;

  const parsedPrice = Number(price);
  const parsedQty = Number(qty);
  const totalCost =
    Number.isFinite(parsedPrice) && Number.isFinite(parsedQty)
      ? parsedPrice * parsedQty
      : 0;

  const validationError = useMemo(() => {
    if (!Number.isInteger(parsedPrice) || parsedPrice < 1 || parsedPrice > 99) {
      return "Price must be an integer between 1 and 99.";
    }
    if (!Number.isInteger(parsedQty) || parsedQty < 1) {
      return "Quantity must be a positive integer.";
    }
    if (orderType === "buy" && totalCost > balance) {
      return "Insufficient balance for this order.";
    }
    if (orderType === "sell" && parsedQty > positionQty) {
      return `Insufficient ${side.toUpperCase()} position.`;
    }
    return null;
  }, [parsedPrice, parsedQty, orderType, totalCost, balance, positionQty, side]);

  const handleSubmit = async () => {
    if (validationError) {
      pushToast(validationError, "error");
      return;
    }

    try {
      const message = await placeOrderMutation.mutateAsync({
        marketId,
        side,
        type: orderType,
        price: parsedPrice,
        qty: parsedQty,
      });
      pushToast(message, "success");
    } catch (error) {
      pushToast(getApiErrorMessage(error), "error");
    }
  };

  if (!isAuthenticated) {
    return (
      <Card title="Trade" subtitle="Connect your wallet to place orders">
        <p className="muted-copy">
          Sign in with Phantom or Solflare to buy and sell outcome shares.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Trade" subtitle="Place a limit order on this market">
      <div className="segmented-control">
        <button
          type="button"
          className={side === "yes" ? "active yes" : ""}
          onClick={() => setSide("yes")}
        >
          Yes
        </button>
        <button
          type="button"
          className={side === "no" ? "active no" : ""}
          onClick={() => setSide("no")}
        >
          No
        </button>
      </div>

      <div className="segmented-control segmented-control-secondary">
        <button
          type="button"
          className={orderType === "buy" ? "active" : ""}
          onClick={() => setOrderType("buy")}
        >
          Buy
        </button>
        <button
          type="button"
          className={orderType === "sell" ? "active" : ""}
          onClick={() => setOrderType("sell")}
        >
          Sell
        </button>
      </div>

      <div className="form-grid">
        <Input
          label="Limit price (¢)"
          type="number"
          min={1}
          max={99}
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          hint="1–99 cents per share"
        />
        <Input
          label="Quantity"
          type="number"
          min={1}
          value={qty}
          onChange={(event) => setQty(event.target.value)}
          hint={`Available: ${orderType === "sell" ? positionQty : formatCents(balance)}`}
        />
      </div>

      <div className="trade-summary">
        <div>
          <span>Estimated {orderType === "buy" ? "cost" : "proceeds"}</span>
          <strong>{formatCents(totalCost)}</strong>
        </div>
        <div>
          <span>Your {side.toUpperCase()} position</span>
          <strong>{positionQty}</strong>
        </div>
      </div>

      {validationError ? <p className="field-error">{validationError}</p> : null}

      <Button
        variant={side === "yes" ? "yes" : "no"}
        className="full-width"
        loading={placeOrderMutation.isPending}
        onClick={handleSubmit}
      >
        {orderType === "buy" ? "Buy" : "Sell"} {side.toUpperCase()}
      </Button>
    </Card>
  );
}
