import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import CommonHeader from "@/components/CommonHeader";
import AppColors from "@/constants/Colors";
import { Product } from "@/type";
import { getProduct } from "@/lib/api";

const SingleProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const idNum = Number(id);
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const data = await getProduct(idNum);
        setProduct(data);
      } catch (error) {
        setError("Failed to fetch product data");
        console.log("Error: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    // if (id) {
    //   fetchProductData();
    // }
  }, [id]);

  console.log(product, "product");

  return (
    <View
      style={{ paddingTop: 30, backgroundColor: AppColors.background.primary }}
    >
      <CommonHeader />
    </View>
  );
};

export default SingleProductScreen;

const styles = StyleSheet.create({});
