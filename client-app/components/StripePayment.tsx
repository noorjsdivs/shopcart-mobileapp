import { Alert, StyleSheet, Text, View } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import React from "react";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";

type Props = {
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  orderId: string;
  userEmail: string;
  onSuccess?: () => void;
};

const StripePayment = ({
  paymentIntent,
  ephemeralKey,
  customer,
  orderId,
  userEmail,
  onSuccess,
}: Props) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const router = useRouter();
  const returnURL = Linking.createURL("/(tabs)/orders");
  //   Initialize payment sheet
  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      merchantDisplayName: "Shopcart Store",
      returnURL: returnURL,
    });
    if (error) {
      throw new Error(`Init payment sheet failed: ${error.message}`);
    }
  };

  const updatedPaymentStatus = async () => {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: "success" })
      .eq("id", orderId)
      .select();

    if (error) {
      throw new Error(`Update payment status failed: ${error.message}`);
    }
  };
  const handlePayment = async () => {
    try {
      await initializePaymentSheet();
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        throw new Error(`Payment failed: ${presentError.message}`);
      }
      await updatedPaymentStatus();
      Alert.alert("Payment Successful!", "Thank you for your purchase", [
        {
          text: "OK",
          onPress: () => {
            onSuccess?.() || router.push("/(tabs)/orders");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Payment failed");
      console.log("payment failed error:", error);
    }
  };

  return {
    handlePayment,
  };
};

export default StripePayment;

const styles = StyleSheet.create({});
