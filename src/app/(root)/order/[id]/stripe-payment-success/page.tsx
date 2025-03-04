import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";
import { getOrderById } from "@/lib/actions/order.actions";
import { Button } from "@/components/ui/button";
import { getServerTranslations } from "@/i18n/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export const metadata: Metadata = {
  title: "Успешно Плащане Чрез Карта",
};
const SuccessPage = async (props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment_intent: string }>;
}) => {
  const { t } = await getServerTranslations();
  //  Get the order id and payment intent id from the URL
  const { id } = await props.params;
  const { payment_intent: paymentIntentId } = await props.searchParams;

  // Fetch order
  const order = await getOrderById(id);
  if (!order) notFound();

  // Retrieve the payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // Check if the payment intent is valid
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound();
  }

  // Check if the payment intent is successful
  const isSuccess = paymentIntent.status === "succeeded";

  if (!isSuccess) return redirect(`/order/${id}`);

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8">
      <div className="flex flex-col gap-6 items-center ">
        <h1 className="h1-bold">{t("thanksForPurchase")}</h1>
        <div>{t("processingOrder")}</div>
        <Button asChild>
          <Link href={`/order/${id}`}>{t("viewOrder")}</Link>
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
