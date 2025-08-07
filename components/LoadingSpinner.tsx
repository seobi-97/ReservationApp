import React from "react";
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";

interface LoadingSpinnerProps {
  visible: boolean;
  text?: string;
  size?: "small" | "large";
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  visible,
  text = "로딩 중...",
  size = "large",
  color,
}) => {
  const colorScheme = useColorScheme();

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.spinnerContainer,
          colorScheme === "dark" && styles.darkSpinnerContainer,
        ]}
      >
        <ActivityIndicator
          size={size}
          color={color || (colorScheme === "dark" ? "#ffffff" : "#007BFF")}
        />
        <Text style={[styles.text, colorScheme === "dark" && styles.darkText]}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  spinnerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    minHeight: 120,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android elevation
    elevation: 5,
    // Web boxShadow
    ...(Platform.OS === "web" && {
      boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)",
    }),
  },
  darkSpinnerContainer: {
    backgroundColor: "#333",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  darkText: {
    color: "#ffffff",
  },
});

export default LoadingSpinner;
