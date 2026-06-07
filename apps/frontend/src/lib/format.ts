export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatPrice(price: number): string {
  return `${price}¢`;
}

export function formatPercent(price: number): string {
  return `${price}%`;
}

export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}

export function getOrderQty(entry: { qty?: number; totalQty?: number }): number {
  return entry.qty ?? entry.totalQty ?? 0;
}
