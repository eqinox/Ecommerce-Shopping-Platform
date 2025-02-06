import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

// Initialize Stripe with the secret API key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// LOGGING FUNCTION
// eslint-disable-next-line
async function logWebhookEvent(event: any) {
  console.log("Received Webhook Event:", JSON.stringify(event, null, 2));

  // If you have a logging service or database, log it there too
  // Example: Save to a file or database for debugging
}

export async function POST(req: NextRequest) {
  try {
    // Log headers and body
    console.log("Headers:", JSON.stringify(req.headers));
    console.log("Raw body:", await req.text());

    // Construct the Stripe event
    const event = await stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // Log the received event
    await logWebhookEvent(event);

    // Process the event
    if (event.type === "charge.succeeded") {
      console.log("charge.succeeded event detected");

      // Retrieve the order ID from metadata
      const { object } = event.data;

      console.log("Order ID:", object.metadata.orderId);
      console.log("Payment details:", {
        id: object.id,
        status: "COMPLETED",
        email: object.billing_details.email,
        pricePaid: (object.amount / 100).toFixed(),
      });

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
        console.log("updateOrderToPaid executed successfully.");
      } catch (error) {
        console.error("Error in updateOrderToPaid function:", error);
      }

      return NextResponse.json({
        message: "updateOrderToPaid was successful",
      });
    }

    console.log("Event is not charge.succeeded");
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
