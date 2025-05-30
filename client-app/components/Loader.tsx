import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import AppColors from "@/constants/Colors";
const { width } = Dimensions.get("window");

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={AppColors.primary[500]} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: width,
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10, // Ensure loader is above content
  },
});
