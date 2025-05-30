import { Router } from "express";
import stripe from "../lib/stripe.js";

const router = Router();

router.post("/checkout", async (req, res) => {
  const reqBody = await req.body;
  const { email, price } = reqBody;

  //   Ensure price is a valid number and convert to integer cents
  if (typeof price !== "number" || isNaN(price) || price <= 0) {
    return res.status(400).send({
      success: false,
      message: "Invalid price value",
    });
  }

  //   Convert price to cents and ensure it's an integer
  const amountInCents = Math.round(price * 100);

  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {
        customer: customer.id,
      },
      { apiVersion: "2025-04-30.basil" }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "USD",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: email,
      description: `Order from ${email}`,
      metadata: {
        email: email,
      },
    });

    return res.status(200).send({
      success: true,
      message: "Payment session created successfully!",
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).send({
      success: false,
      message: "Payment failed",
    });
  }
});

export default router;
