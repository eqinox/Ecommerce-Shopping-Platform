import { auth } from "@/auth";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { formatCurrency } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import PlaceOrderForm from "./place-form-order";
import { getServerTranslations } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Направете Поръчка",
};

const PlaceOrderPage = async () => {
  const { t } = await getServerTranslations();
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("User not found");

  const user = await getUserById(userId);

  if (!cart || cart.items.length === 0) redirect("/cart");
  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");

  const userAddress = user.address as ShippingAddress;

  return (
    <div>
      <CheckoutSteps current={3} />
      <h1 className="py-4 text-2xl">{t("placeOrder")}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{t("shippingAddress")}</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.city}{" "}
                {userAddress.postalCode}, {userAddress.country}{" "}
              </p>
              <div className="mt-3">
                <Link href="/shipping-address">
                  <Button variant="outline">{t("edit")}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{t("payment.method")}</h2>
              <p>{user.paymentMethod}</p>
              <div className="mt-3">
                <Link href="/payment-method">
                  <Button variant="outline">{t("edit")}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{t("orderItems")}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("item")}</TableHead>
                    <TableHead>{t("quantity")}</TableHead>
                    <TableHead>{t("price")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">
                            {item.name}. Размер: {item.size}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell>
                        {item.price} {t("currency")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="p-4 gap-4 space-y-4">
            <div className="flex justify-between">
              <div>{t("items")}</div>
              <div>{formatCurrency(cart.itemsPrice)}</div>
            </div>

            <div className="flex justify-between">
              <div>{t("tax")}</div>
              <div>{formatCurrency(cart.taxPrice)}</div>
            </div>

            <div className="flex justify-between">
              <div>{t("shipping")}</div>
              <div>{formatCurrency(cart.shippingPrice)}</div>
            </div>

            <div className="flex justify-between">
              <div>{t("total")}</div>
              <div>{formatCurrency(cart.totalPrice)}</div>
            </div>
            <PlaceOrderForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlaceOrderPage;
