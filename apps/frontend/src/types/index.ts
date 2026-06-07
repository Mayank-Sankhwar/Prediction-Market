export type PositionType = "Yes" | "No";

export interface OrderbookLevel {
  availableQty: number;
  orders: OrderbookOrder[];
}

export interface OrderbookOrder {
  userId: string;
  qty: number;
  filledQty: number;
  originalOrderId: string;
  reverseOrder: boolean;
}

export type Orderbook = Record<string, OrderbookLevel>;

export interface Market {
  id: string;
  title: string;
  description: string;
  resolutionDescription: string;
  yesOrderbook: Orderbook | string;
  noOrderbook: Orderbook | string;
  totalQty: number;
  resolution: PositionType | null;
}

export interface Position {
  id: string;
  userId: string;
  marketId: string;
  type: PositionType;
  qty: number;
}

export interface OrderHistoryEntry {
  id: string;
  orderType: string;
  totalQty?: number;
  qty?: number;
  price: number;
  userId: string;
  marketId: string;
}

export interface PlaceOrderPayload {
  marketId: string;
  side: "yes" | "no";
  type: "buy" | "sell";
  price: number;
  qty: number;
}

export interface SplitMergePayload {
  marketId: string;
  amount: number;
}

export interface AuthClaims {
  sub?: string;
  address?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    solflare?: {
      isSolflare?: boolean;
      connect: () => Promise<void>;
      signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
      publicKey?: { toString: () => string; toBase58: () => string };
    };
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        connect: () => Promise<{ publicKey: { toString: () => string } }>;
        signMessage: (
          message: Uint8Array,
        ) => Promise<{ signature: Uint8Array }>;
        publicKey?: { toString: () => string };
      };
    };
  }
}
