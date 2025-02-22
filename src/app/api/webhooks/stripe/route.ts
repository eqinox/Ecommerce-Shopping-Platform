import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

export async function POST(req: NextRequest) {
  try {
    // Construct the Stripe event
    const event = await Stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // Process the event
    if (event.type === "charge.succeeded") {
      // Retrieve the order ID from metadata
      const { object } = event.data;

      // CALL THE UPDATE FUNCTION
      try {
        await updateOrderToPaid({
          orderId: object.metadata.orderId,
          paymentResult: {
            id: object.id,
            status: "COMPLETED",
            email_address: object.billing_details.email!,
            pricePaid: (object.amount / 100).toFixed(),
          },
        });
      } catch (error) {
        console.error("Error in updateOrderToPaid function:", error);
      }

      return NextResponse.json({
        message: "updateOrderToPaid was successful",
      });
    }

    return NextResponse.json({
      message: "Event received but not processed",
    });
  } catch (
    // eslint-disable-next-line
    error: any
  ) {
    console.error("Error handling Stripe webhook:", error.message);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 400 }
    );
  }
}
