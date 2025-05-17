import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AppColors from "@/constants/Colors";
import {
  AntDesign,
  Feather,
  Foundation,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Props {
  isFav?: boolean;
  showCart?: boolean;
  handleToggleFavorite?: () => void;
}

const CommonHeader = ({ isFav, showCart, handleToggleFavorite }: Props) => {
  const router = useRouter();
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Feather name="arrow-left" size={20} color={AppColors.text.primary} />
      </TouchableOpacity>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={[styles.favoriteButton, isFav && styles.activeFavoriteButton]}
        >
          <AntDesign
            name="hearto"
            size={20}
            color={
              isFav ? AppColors.background.primary : AppColors.text.primary
            }
            fill={isFav ? AppColors.background.primary : "transparent"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/cart")}
          style={[styles.favoriteButton, isFav && styles.activeFavoriteButton]}
        >
          <MaterialCommunityIcons
            name="cart-outline"
            size={24}
            color={
              isFav ? AppColors.background.primary : AppColors.text.primary
            }
            fill={isFav ? AppColors.background.primary : "transparent"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  activeFavoriteButton: {
    backgroundColor: AppColors.error,
  },
  buttonView: {
    flexDirection: "row",
    gap: 5,
  },
});
