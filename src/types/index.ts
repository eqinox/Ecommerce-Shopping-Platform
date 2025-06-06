import { z } from "zod";

import {
  AllSizesSchema,
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  insertProductsSchema,
  insertReviewSchema,
  paymentResultSchema,
  productSizeSchema,
  shippingAddressChema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductsSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};
export type ProductSize = z.infer<typeof productSizeSchema>;
export type AllSizes = z.infer<typeof AllSizesSchema>;

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressChema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
  paymentResult: PaymentResult;
};
export type PaymentResult = z.infer<typeof paymentResultSchema>;
export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};
