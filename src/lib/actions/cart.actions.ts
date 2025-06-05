"use server";

import { CartItem, ProductSize } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Calculate cart prices
const calcPrice = (items: z.infer<typeof cartItemSchema>[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Сесията на количката не е намерена");

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await getMyCart();
    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error("Продуктът не е намерен");

    // Parse sizes from JSON
    const sizes = product.sizes as ProductSize[];
    const selectedSize = sizes.find((s) => s.size === item.size);
    if (!selectedSize || selectedSize.quantity < 1) {
      throw new Error("Няма наличност от избрания размер");
    }

    if (!cart) {
      // Decrease stock and selected size quantity
      await prisma.product.update({
        where: { id: product.id },
        data: {
          stock: product.stock - 1,
          sizes: sizes.map((s) =>
            s.size === item.size ? { ...s, quantity: s.quantity - 1 } : s
          ),
        },
      });

      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({ data: newCart });
    } else {
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId && x.size === item.size
      );

      if (existItem) {
        if (product.stock < existItem.qty + 1 || selectedSize.quantity < 1) {
          throw new Error("Недостатъчна наличност");
        }

        existItem.qty += 1;
      } else {
        if (product.stock < 1) throw new Error("Недостатъчна наличност");

        cart.items.push(item);
      }

      // Decrease stock and size quantity
      await prisma.product.update({
        where: { id: product.id },
        data: {
          stock: product.stock - 1,
          sizes: sizes.map((s) =>
            s.size === item.size ? { ...s, quantity: s.quantity - 1 } : s
          ),
        },
      });

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });
    }

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} ${
        cart
          ? cart.items.length > 1
            ? "актуализирано в"
            : "добавено в"
          : "добавено в"
      } количката`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function addItemToCart2(data: CartItem) {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
      throw new Error("Сесията на количката не е намерена");
    }

    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();
    // Parse and validate item
    const item = cartItemSchema.parse(data);

    // Find product in database
    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    });

    if (!product) throw new Error("Продуктът не е намерен");

    if (!cart) {
      // Create new cart object
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({
        data: newCart,
      });

      //Revalidate product page
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} добавено в количката`,
      };
    } else {
      // Check if item is already in cart
      // const existItem = (cart.items as CartItem[]).find(
      //   (x) => x.productId === item.productId
      // );
      const existItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId && x.size === item.size
      );

      if (existItem) {
        // Check stock
        if (product.stock < existItem.qty + 1) {
          throw new Error("Недостатъчна наличност");
        }

        existItem.qty += 1;
      } else {
        if (product.stock < 1) throw new Error("Недостатъчна наличност");

        cart.items.push(item);
      }

      // Save to database
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existItem ? "актуализирано в" : "добавено в"
        } количката`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) throw new Error("Сесията на количката не е намерена");

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) {
    return undefined;
  }

  // Convert decimals and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string, size: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Сесията на количката не е намерена");

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Продуктът не е намерен");

    const cart = await getMyCart();
    if (!cart) throw new Error("Количката не е намерена");

    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId && x.size === size
    );
    if (!exist) throw new Error("Артикулът не е намерен");

    // Increase product stock and size quantity
    const sizes = product.sizes as ProductSize[];
    const updatedSizes = sizes.map((s) =>
      s.size === size ? { ...s, quantity: s.quantity + 1 } : s
    );

    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: product.stock + 1,
        sizes: updatedSizes,
      },
    });

    // Update cart
    if (exist.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (x) => !(x.productId === productId && x.size === size)
      );
    } else {
      (cart.items as CartItem[]).find(
        (x) => x.productId === productId && x.size === size
      )!.qty -= 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} (${size}) беше премахнат от количката`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function removeItemFromCart2(productId: string, size: string) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) throw new Error("Сесията на количката не е намерена");

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error("Продуктът не е намерен");

    const cart = await getMyCart();
    if (!cart) throw new Error("Количката не е намерена");

    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId && x.size === size
    );
    if (!exist) throw new Error("Артикулът не е намерен");

    if (exist.qty === 1) {
      // Remove item completely
      cart.items = (cart.items as CartItem[]).filter(
        (x) => !(x.productId === productId && x.size === size)
      );
    } else {
      // Decrease quantity by 1
      (cart.items as CartItem[]).find(
        (x) => x.productId === productId && x.size === size
      )!.qty -= 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} (${size}) беше премахнат от количката`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
