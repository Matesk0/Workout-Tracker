import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert, // Add this
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, DefaultThemes, Theme } from "../constants/colors";
import { themeStorage } from "../services/themeStorage";
import { useFocusEffect } from "@react-navigation/native";

export default function ThemeSettingsScreen({ navigation }: any) {
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      loadActiveTheme();
    }, [])
  );

  const loadActiveTheme = async () => {
    try {
      const theme = await themeStorage.getActiveTheme();
      setActiveTheme(theme);
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const handleSelectTheme = async (theme: Theme) => {
    try {
      await themeStorage.setActiveTheme(theme);
      setActiveTheme(theme);
      Alert.alert(
        "Theme Changed",
        "Please restart the app to apply the new theme.",
        [{ text: "OK" }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to save theme");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle"
            size={24}
            color={Colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>App Theme</Text>
            <Text style={styles.infoText}>
              Choose a theme for the app. You'll need to restart the app to see
              the changes.
            </Text>
          </View>
        </View>

        {/* Theme Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Themes</Text>
          {DefaultThemes.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeCard,
                activeTheme?.id === theme.id && styles.themeCardActive,
              ]}
              onPress={() => handleSelectTheme(theme)}
            >
              <View style={styles.themeHeader}>
                <View style={styles.colorPreview}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: theme.colors.primary },
                    ]}
                  />
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: theme.colors.secondary },
                    ]}
                  />
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: theme.colors.accent },
                    ]}
                  />
                </View>
                <View style={styles.themeInfo}>
                  <Text style={styles.themeName}>{theme.name}</Text>
                  {activeTheme?.id === theme.id && (
                    <Text style={styles.activeLabel}>Active</Text>
                  )}
                </View>
                {activeTheme?.id === theme.id && (
                  <Ionicons
                    name="checkmark-circle"
                    size={28}
                    color={Colors.primary}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Coming Soon */}
        <View style={styles.comingSoonCard}>
          <Ionicons name="sparkles" size={32} color={Colors.primary} />
          <View style={styles.comingSoonContent}>
            <Text style={styles.comingSoonTitle}>Custom Themes</Text>
            <Text style={styles.comingSoonText}>
              Create your own custom color themes - coming soon!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: Colors.primary + "10",
    padding: 20,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary + "30",
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    opacity: 0.8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  themeCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  themeCardActive: {
    borderColor: Colors.primary,
  },
  themeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  colorPreview: {
    flexDirection: "row",
    gap: 8,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  activeLabel: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
  },
  comingSoonCard: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: Colors.card,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  comingSoonContent: {
    flex: 1,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
