import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import AppColors from "@/constants/Colors";
import { useRouter } from "expo-router";

const Logo = () => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.logoView} onPress={() => router.push("/")}>
      <MaterialIcons
        name="shopping-cart"
        size={25}
        color={AppColors.primary[700]}
      />
      <Text style={styles.logoText}>shopcart</Text>
    </TouchableOpacity>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logoView: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.primary[700],
    marginLeft: 2,
  },
});
