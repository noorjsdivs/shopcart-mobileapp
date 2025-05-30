import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { StripeProvider } from "@stripe/stripe-react-native";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const publishableKey =
    "pk_test_51RDMQo2Ktw1fbarBqtEihz7JXL95T1Git1kQ466X0PHQq0FsWWJ6l8TrYPPlSaMOcOwxnjgb7WZdKFdLGdXKog7Z00kZQBqJ9W";

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <StripeProvider publishableKey={publishableKey}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </StripeProvider>
  );
}
