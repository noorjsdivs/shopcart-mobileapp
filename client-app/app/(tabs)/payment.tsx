import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppColors from "@/constants/Colors";
import Button from "@/components/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import StripePayment from "@/components/StripePayment";

// Utility function
const getStringParam = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? value[0] : value || "";

const PaymentScreen = () => {
  const router = useRouter();
  const { paymentIntent, ephemeralKey, customer, total, orderId } =
    useLocalSearchParams();
  const { user } = useAuthStore();
  const totalValue = Number(getStringParam(total));

  const stripe = StripePayment({
    paymentIntent: getStringParam(paymentIntent),
    ephemeralKey: getStringParam(ephemeralKey),
    customer: getStringParam(customer),
    orderId: getStringParam(orderId),
    userEmail: user?.email || "",
    onSuccess: () => router.push("/(tabs)/orders"),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Payment</Text>
      <Text style={styles.subtitle}>
        Please confirm your payment details to complete the purchase
      </Text>
      <Text style={styles.totalPrice}>Total: ${totalValue.toFixed(2)}</Text>
      <Button
        title="Confirm payment"
        onPress={stripe.handlePayment}
        fullWidth
        style={styles.button}
      />
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.background.primary,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: AppColors.text.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: AppColors.text.secondary,
    textAlign: "center",
    marginBottom: 32,
  },
  totalPrice: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.text.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
});
