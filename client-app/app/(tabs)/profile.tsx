import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import Wrapper from "@/components/Wrapper";
import AppColors from "@/constants/Colors";
import Button from "@/components/Button";
import {
  Feather,
  FontAwesome5,
  Foundation,
  MaterialIcons,
} from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const ProfileScreen = () => {
  const { user, logout, checkSession, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      checkSession();
    }
  }, [user]);

  const menuItems = [
    {
      id: "cart",
      icon: (
        <Foundation
          name="shopping-cart"
          size={20}
          color={AppColors.primary[500]}
        />
      ),
      title: "My Cart",
      onPress: () => {
        router.push("/(tabs)/cart");
      },
    },
    {
      id: "orders",
      icon: (
        <FontAwesome5
          name="box-open"
          size={16}
          color={AppColors.primary[500]}
        />
      ),
      title: "My Orders",
      onPress: () => {
        router.push("/(tabs)/orders");
      },
    },
    {
      id: "payment",
      icon: (
        <Foundation
          name="credit-card"
          size={20}
          color={AppColors.primary[500]}
        />
      ),
      title: "Payment Methods",
      onPress: () => {},
    },
    {
      id: "address",
      icon: <Foundation name="home" size={20} color={AppColors.primary[500]} />,
      title: "Shipping Addresses",
      onPress: () => {},
    },
    {
      id: "settings",
      icon: <Foundation name="home" size={20} color={AppColors.primary[500]} />,
      title: "Settings",
      onPress: () => {},
    },
  ];

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logout();
            Toast.show({
              type: "success",
              text1: "Log out successful",
              text2: "You have been logged out",
              visibilityTime: 2000,
            });
          } catch (error) {
            console.error("Profile: Error during logout:", error);
            Alert.alert("Logout Error", "An unexpected error occurred");
          }
        },
      },
    ]);
  };

  return (
    <Wrapper>
      {user ? (
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>My Profile</Text>
          </View>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Feather name="user" size={40} color={AppColors.gray[400]} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <TouchableOpacity>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.menuContainer}>
            {menuItems?.map((item) => (
              <TouchableOpacity
                key={item?.id}
                style={styles.menuItem}
                onPress={item?.onPress}
              >
                <View style={styles.menuItemLeft}>
                  {item?.icon}
                  <Text style={styles.menuItemTitle}>{item?.title}</Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={AppColors.gray[400]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.logoutContainer}>
            <Button
              title="Logout"
              onPress={handleLogout}
              variant="outline"
              fullWidth
              style={styles.logoutButton}
              textStyle={styles.logoutButtonText}
              disabled={isLoading}
            />
          </View>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.message}>
            Please log in or sign up to access your profile and enjoy all
            features.
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Log In"
              fullWidth
              style={styles.loginButton}
              textStyle={styles.buttonText}
              onPress={() => router.push("/(tabs)/login")}
            />
            <Button
              title="Sign Up"
              variant="outline"
              fullWidth
              style={styles.signupButton}
              textStyle={styles.signupButtonText}
              onPress={() => router.push("/(tabs)/signup")}
            />
          </View>
        </View>
      )}
    </Wrapper>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingBottom: 16,
    backgroundColor: AppColors.background.primary,
    marginTop: Platform.OS === "android" ? 30 : 0,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: AppColors.text.primary,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppColors.gray[200],
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileEmail: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.text.primary,
    marginBottom: 4,
  },
  editProfileText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.primary[500],
  },
  menuContainer: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: AppColors.text.primary,
    marginLeft: 12,
  },
  logoutContainer: {
    marginTop: 24,
  },
  logoutButton: {
    backgroundColor: "transparent",
    borderColor: AppColors.error,
  },
  logoutButtonText: {
    color: AppColors.error,
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: AppColors.text.secondary,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  loginButton: {
    backgroundColor: AppColors.primary[500],
  },
  buttonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.background.primary,
  },
  signupButton: {
    borderColor: AppColors.primary[500],
    backgroundColor: "transparent",
  },
  signupButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: AppColors.primary[500],
  },
});
