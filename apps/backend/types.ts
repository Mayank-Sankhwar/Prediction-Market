import z from "zod";
 export const CreateOrderSchema=z.object({
    marketId: z.string(),
    side: z.enum(["yes","no"]),
    tupe: z.enum(["buy","sell"]),
    price: z.int(),
    qty: z.int()
 })
 export type Orderbook = {[key: string]: {
    availableQty: number,
    orders: { userId: string, qty: number, filledQty: number, originalOrderId: string, reverseOrder: boolean }[]
}}

const prices = Object.keys(yesOrderbook).sort((a: string, b: string) => Number(a) - Number(b));