import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { Colors } from "./constants/colors";

// Custom dark theme based on Apple's design
const AppleDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.backgroundElevated,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.primary,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={AppleDarkTheme}>
      <StatusBar style="light" />
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
