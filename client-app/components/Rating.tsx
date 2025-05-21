import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import AppColors from "@/constants/Colors";

interface RatingProps {
  rating: number;
  count?: number;
  size?: number;
  showCount?: boolean;
}

const Rating: React.FC<RatingProps> = ({
  rating,
  count,
  size = 16,
  showCount = true,
}) => {
  const roundedRating = Math.round(rating * 2) / 2;
  const renderStars = () => {
    const stars = [];
    // Full star
    for (let i = 1; i <= Math.floor(roundedRating); i++) {
      stars.push(
        <AntDesign
          name="star"
          key={`star-${i}`}
          size={size}
          color={AppColors.accent[500]}
          fill={AppColors.accent[500]}
        />
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(roundedRating);
    for (let i = 1; i <= emptyStars; i++) {
      stars.push(
        <Feather
          name="star"
          key={`empty-star-${i}`}
          size={size}
          color={AppColors.accent[500]}
        />
      );
    }

    return stars;
  };
  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>{renderStars()}</View>
      {showCount && count !== undefined && (
        <Text style={styles.count}>({count})</Text>
      )}
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  count: {
    marginLeft: 4,
    fontSize: 14,
    color: AppColors.text.secondary,
  },
  halfStarContainer: {
    position: "relative",
  },
  halfStarBackground: {
    // position: "absolute",
  },
  halfStarOverlay: {
    position: "absolute",
    width: "50%",
    overflow: "hidden",
  },
  halfStarForeground: {
    position: "absolute",
  },
});
