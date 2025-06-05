"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  approvePaypalOrder,
  createPayPalOrder,
  deliverOrder,
  updateOrderToPaidCOD,
} from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import StripePayment from "./stripe-payment";
import { useTranslation } from "react-i18next";

interface Props {
  order: Omit<Order, "paymentResult">;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}

const OrderDetailsTable: React.FC<Props> = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { t: commonT } = useTranslation();

  const {
    //id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
  } = order;

  const PrintLoadingState = () => {
    const { t } = useTranslation();
    const [{ isPending }] = usePayPalScriptReducer();

    let status = "";

    if (isPending) {
      status = t("loadingPaypal");
    } else {
      status = "Error Loading PayPal";
    }
    return status;
  };

  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(order.id);

    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
    }

    return res.data;
  };

  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePaypalOrder(order.id, data);

    toast({
      variant: res.success ? "default" : "destructive",
      description: res.message,
    });
  };

  // Button to mark order as paid
  const MarkAsPaidButton = () => {
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message,
            });
          })
        }
      >
        {isPending ? "Processing..." : "Mark As Paid"}
      </Button>
    );
  };

  const MarkAsDeliveredButton = () => {
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliverOrder(order.id);
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message,
            });
          })
        }
      >
        {isPending ? "Processing..." : "Mark As Delivered"}
      </Button>
    );
  };

  return (
    <div>
      <h1 className="py-4 text-2xl">
        {commonT("order")} {formatId(order.id)}
      </h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-4-y overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{commonT("payment.method")}</h2>
              <p className="mb-2">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant="secondary">
                  {commonT("paidAt")} {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">{commonT("notPaid")}</Badge>
              )}
            </CardContent>
          </Card>
          <Card className="my-2">
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{commonT("shippingAddress")}</h2>
              <p className="mb-2">{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant="secondary">
                  {commonT("deliveredAt")}{" "}
                  {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant="destructive">{commonT("notDelivered")}</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">{commonT("orderItems")}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{commonT("item")}</TableHead>
                    <TableHead>{commonT("quantity")}</TableHead>
                    <TableHead>{commonT("price")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item, index) => (
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
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.qty}</span>
                      </TableCell>
                      <TableCell>
                        {item.price} {commonT("currency")}
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
              <div>{commonT("items")}</div>
              <div>{formatCurrency(itemsPrice)}</div>
            </div>

            <div className="flex justify-between">
              <div>{commonT("tax")}</div>
              <div>{formatCurrency(taxPrice)}</div>
            </div>

            <div className="flex justify-between">
              <div>{commonT("shipping")}</div>
              <div>{formatCurrency(shippingPrice)}</div>
            </div>

            <div className="flex justify-between">
              <div>{commonT("total")}</div>
              <div>{formatCurrency(totalPrice)}</div>
            </div>
            {/* PayPal Payment */}
            {!isPaid && paymentMethod === "Paypal" && (
              <div>
                <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                  <PrintLoadingState />
                  <PayPalButtons
                    createOrder={handleCreatePayPalOrder}
                    onApprove={handleApprovePayPalOrder}
                  />
                </PayPalScriptProvider>
              </div>
            )}

            {/* Stripe Payment */}
            {!isPaid && paymentMethod === "Stripe" && stripeClientSecret && (
              <StripePayment
                priceInCents={Number(order.totalPrice) * 100}
                orderId={order.id}
                clientSecret={stripeClientSecret}
              />
            )}

            {/* Cash On Delivery */}
            {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
              <MarkAsPaidButton />
            )}
            {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsTable;
