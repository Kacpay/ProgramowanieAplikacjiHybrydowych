import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <ThemeProvider>
    <SafeAreaProvider>
    <Stack screenOptions={{ headerShown: false}}>
    </Stack>
  </SafeAreaProvider>
  </ThemeProvider>
  );
}
