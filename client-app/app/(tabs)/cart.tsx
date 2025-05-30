import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import MainLayout from "@/components/MainLayout";
import EmptyState from "@/components/EmptyState";
import AppColors from "@/constants/Colors";
import { Title } from "@/components/customText";
import CartItem from "@/components/CartItem";
import Button from "@/components/Button";
import Toast from "react-native-toast-message";
import { supabase } from "@/lib/supabase";
import axios from "axios";

const CartScreen = () => {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const subtotal = getTotalPrice();
  const shippingCost = subtotal > 50 ? 5.99 : 0;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = async () => {
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "Please login to place an order",
        position: "bottom",
        visibilityTime: 2000,
      });
      return;
    }
    try {
      setLoading(true);
      const orderData = {
        user_email: user.email,
        total_price: total,
        items: items.map((item) => ({
          product_id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        payment_status: "pending",
      };
      // Insert order into Supabase
      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to save order: ${error.message}`);
      }
      const payload = {
        price: total,
        email: user?.email,
      };
      const response = await axios.post(
        "http://localhost:8000/checkout",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { paymentIntent, ephemeralKey, customer } = response.data;
      if (!paymentIntent || !ephemeralKey || !customer) {
        throw new Error("Missing required Stripe data from server");
      } else {
        // Navigate to PaymentScreen with Stripe data as props
        Toast.show({
          type: "success",
          text1: "Order Placed",
          text2: "Order placed successfully",
          position: "bottom",
          visibilityTime: 2000,
        });
        router.push({
          pathname: "/(tabs)/payment",
          params: {
            paymentIntent,
            ephemeralKey,
            customer,
            orderId: data.id, // Pass supabase order ID for potential updates
            total: total,
          },
        });
        clearCart();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Order Failed",
        text2: "Failed to place order",
        position: "bottom",
        visibilityTime: 2000,
      });
      console.log("Error placing order:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <MainLayout>
      {items?.length > 0 ? (
        <>
          <View style={styles.headerView}>
            <View style={styles.header}>
              <Title>Shopping Cart</Title>
              <Text style={styles.itemCount}>{items?.length} items</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => clearCart()}>
                <Text style={styles.resetText}>Clear Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id.toString()}
            renderItem={({ item }) => (
              <CartItem product={item.product} quantity={item.quantity} />
            )}
            contentContainerStyle={styles.cartItemsContainer}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            {shippingCost > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>
                  ${shippingCost.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
            </View>
            <Button
              title="Place Order"
              fullWidth
              style={styles.checkoutButton}
              disabled={!user || loading}
              onPress={handlePlaceOrder}
            />
            {!user && (
              <View style={styles.alertView}>
                <Text style={styles.alertText}>
                  Please login to make payment
                </Text>
                <Link href={"/(tabs)/login"}>
                  <Text style={styles.loginText}>Login</Text>
                </Link>
              </View>
            )}
          </View>
        </>
      ) : (
        <EmptyState
          type="cart"
          message="Your Cart is Empty"
          actionLabel="Start Shopping"
          onAction={() => router.push("/(tabs)/shop")}
        />
      )}
    </MainLayout>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  headerView: {
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  header: {
    paddingBottom: 16,
  },

  itemCount: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.text.secondary,
    marginTop: 4,
  },
  cartItemsContainer: {
    paddingVertical: 16,
  },
  summaryContainer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray[200],
    marginBottom: 70,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  summaryValue: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.gray[200],
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.text.primary,
  },
  totalValue: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.primary[600],
  },
  checkoutButton: {
    marginTop: 16,
  },
  alertView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: {
    fontWeight: "500",
    textAlign: "center",
    color: AppColors.error,
    marginRight: 3,
  },
  loginText: {
    fontWeight: "700",
    color: AppColors.primary[500],
  },
  resetText: {
    color: AppColors.error,
  },
});
