import { z } from "zod";

import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";
export const AllSizesSchema = z.enum([
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
]);

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Цената трябва да има точно два знака след десетичната запетая"
  );

// Schema for product sizes
export const productSizeSchema = z.object({
  size: AllSizesSchema,
  quantity: z.number().int().min(0),
});

// Schema for inserting products
export const insertProductsSchema = z.object({
  name: z.string().min(3, "Името трябва да бъде поне 3 символа"),
  slug: z.string().min(3, "Идентификаторът трябва да бъде поне 3 символа"),
  category: z.string().min(3, "Категорията трябва да бъде поне 3 символа"),
  brand: z.string().min(3, "Марката трябва да бъде поне 3 символа"),
  description: z.string().min(3, "Описанието трябва да бъде поне 3 символа"),
  stock: z.coerce.number(),
  images: z
    .array(z.string())
    .min(1, "Продуктът трябва да има поне една снимка"),
  isFeatured: z.boolean().optional(),
  banner: z.string().optional().nullable(),
  price: currency,
  sizes: z.array(productSizeSchema),
});

// Schema for updating products
export const updateProductSchema = insertProductsSchema.extend({
  id: z.string().min(1, "Id е задължително"),
});

// Schema for loging user
export const signInFormSchema = z.object({
  email: z.string().email("Невалиден имейл адрес"),
  password: z.string().min(6, "Паролата трябва да бъде поне 6 символа"),
});

// Schema for signing up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Името трябва да бъде поне 3 символа"),
    email: z.string().email("Невалиден имейл адрес"),
    password: z.string().min(6, "Паролата трябва да бъде поне 6 символа"),
    confirmPassword: z
      .string()
      .min(6, "Паролата трябва да бъде поне 6 символа"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролите не съвпадат",
    path: ["confirmPassword"],
  });

// Cart Schemas
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Името е задължително"),
  slug: z.string().min(1, "Идентификаторът е задължителен"),
  qty: z
    .number()
    .int()
    .nonnegative("Наличността трябва да е положително число"),
  image: z.string().min(1, "Снимката е задължителна"),
  price: currency,
  size: AllSizesSchema,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

export const shippingAddressChema = z.object({
  fullName: z.string().min(3, "Името трябва да съдържа поне 3 символа"),
  streetAddress: z.string().min(3, "Адресът трябва да съдържа поне 3 символа"),
  city: z.string().min(3, "Градът трябва да съдържа поне 3 символа"),
  postalCode: z
    .string()
    .regex(/^\d{4}$/, "Пощенският код трябва да съдържа точно 4 цифри"),
  country: z.string().min(3, "Държавата трябва да съдържа поне 3 символа"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Schema for payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Методът на плащане е задължителен"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Невалиден метод на плащане",
  });

// Schema for inserting order
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "Потребителят е задължителен"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Невалиден метод на плащане",
  }),
  shippingAddress: shippingAddressChema,
});

// Schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
  size: AllSizesSchema,
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// Schema for updating the user profile
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Името трябва да съдържа поне 3 символа"),
  email: z.string().email(),
});

// Schema to update users
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, "ID е задължително"),
  role: z.string().min(1, "Ролята е задължителна"),
});

// Insert Review Schema
export const insertReviewSchema = z.object({
  title: z.string().min(3, "Заглавието трябва да съдържа поне 3 символа"),
  description: z.string().min(3, "Описанието трябва да съдържа поне 3 символа"),
  productId: z.string().min(1, "Продуктът е задължителен"),
  userId: z.string().min(1, "Потребителят е задължителен"),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Оценката трябва да бъде поне 1")
    .max(5, "Оценката трябва да бъде най-много 5"),
});
