import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AppColors from "@/constants/Colors";
import Logo from "./Logo";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const HomeHeader = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Logo />
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.push("/(tabs)/search")}
          >
            <AntDesign
              name="search1"
              size={20}
              color={AppColors.primary[700]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.push("/(tabs)/favorites")}
          >
            <MaterialCommunityIcons
              name="heart-outline"
              size={20}
              color={AppColors.primary[700]}
            />
            <View style={styles.itemsView}>
              <Text style={styles.itemsText}>0</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => router.push("/(tabs)/cart")}
          >
            <MaterialCommunityIcons
              name="cart-outline"
              size={20}
              color={AppColors.primary[700]}
            />
            <View style={styles.itemsView}>
              <Text style={styles.itemsText}>0</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.background.primary,
    marginTop: Platform.OS === "android" ? 35 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[300],
    paddingBottom: 5,
    paddingHorizontal: 20,
  },

  iconContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  searchButton: {
    backgroundColor: AppColors.primary[50],
    borderRadius: 5,
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: AppColors.primary[500],
    position: "relative",
  },
  itemsView: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: 50,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: AppColors.primary[500],
    backgroundColor: AppColors.background.primary,
  },
  itemsText: {
    fontSize: 10,
    color: AppColors.accent[500],
    fontWeight: 800,
  },
});
