import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { settingsStorage, AppSettings } from "../services/settingsStorage";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({ navigation }: any) {
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    restTimerSound: true,
    autoStartRest: true,
    defaultRestTime: 90,
    darkMode: true,
    hapticFeedback: true,
    showCompletedSets: true,
    units: "metric",
    language: "en",
  });

  const loadSettings = async () => {
    try {
      const data = await settingsStorage.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  const handleToggle = async (key: keyof AppSettings) => {
    try {
      const newValue = !settings[key];
      setSettings({ ...settings, [key]: newValue });
      await settingsStorage.updateSetting(key, newValue as any);
    } catch (error) {
      console.error("Error saving setting:", error);
      Alert.alert("Error", "Failed to save setting");
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your workouts, logs, and custom exercises. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                "@workouts",
                "@workout_logs",
                "@exercise_library",
              ]);
              Alert.alert("Success", "All data has been cleared", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
            }
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert("Export Data", "Data export feature coming soon!");
  };

  const handleImportData = () => {
    Alert.alert("Import Data", "Data import feature coming soon!");
  };

  const handleRateApp = () => {
    Alert.alert("Rate App", "Thank you for your support! ⭐");
  };

  const handleShareApp = () => {
    Alert.alert("Share App", "Share with friends feature coming soon!");
  };

  const settingsSections = [
    {
      title: "Appearance",
      icon: "color-palette",
      items: [
        {
          icon: "brush-outline",
          label: "Theme Colors",
          type: "navigation",
          onPress: () => navigation.navigate("ThemeSettings"),
        },
        {
          icon: "moon-outline",
          label: "Dark Mode",
          type: "toggle",
          value: settings.darkMode,
          onToggle: () => handleToggle("darkMode"),
          disabled: true,
          subtitle: "Always enabled",
        },
      ],
    },
    {
      title: "Workout",
      icon: "barbell",
      items: [
        {
          icon: "timer-outline",
          label: "Auto-start Rest Timer",
          subtitle: "Start timer after completing a set",
          type: "toggle",
          value: settings.autoStartRest,
          onToggle: () => handleToggle("autoStartRest"),
        },
        {
          icon: "volume-high-outline",
          label: "Rest Timer Sound",
          subtitle: "Play sound when rest time ends",
          type: "toggle",
          value: settings.restTimerSound,
          onToggle: () => handleToggle("restTimerSound"),
        },
        {
          icon: "checkmark-done-outline",
          label: "Show Completed Sets",
          subtitle: "Highlight completed sets with color",
          type: "toggle",
          value: settings.showCompletedSets,
          onToggle: () => handleToggle("showCompletedSets"),
        },
        {
          icon: "time-outline",
          label: "Default Rest Time",
          subtitle: `${settings.defaultRestTime} seconds`,
          type: "navigation",
          onPress: () => Alert.alert("Coming Soon", "Rest time customization"),
        },
      ],
    },
    {
      title: "Notifications",
      icon: "notifications",
      items: [
        {
          icon: "notifications-outline",
          label: "Push Notifications",
          subtitle: "Workout reminders and motivations",
          type: "toggle",
          value: settings.notifications,
          onToggle: () => handleToggle("notifications"),
        },
        {
          icon: "calendar-outline",
          label: "Workout Reminders",
          subtitle: "Set daily workout reminders",
          type: "navigation",
          onPress: () => Alert.alert("Coming Soon", "Reminder settings"),
        },
      ],
    },
    {
      title: "General",
      icon: "settings",
      items: [
        {
          icon: "phone-portrait-outline",
          label: "Haptic Feedback",
          subtitle: "Vibration on interactions",
          type: "toggle",
          value: settings.hapticFeedback,
          onToggle: () => handleToggle("hapticFeedback"),
        },
        {
          icon: "language-outline",
          label: "Language",
          subtitle: "English",
          type: "navigation",
          onPress: () => Alert.alert("Coming Soon", "Language settings"),
        },
        {
          icon: "scale-outline",
          label: "Units",
          subtitle: "Metric (kg)",
          type: "navigation",
          onPress: () => Alert.alert("Coming Soon", "Unit settings"),
        },
      ],
    },
    {
      title: "Data",
      icon: "server",
      items: [
        {
          icon: "download-outline",
          label: "Export Data",
          subtitle: "Backup your workout data",
          type: "action",
          onPress: handleExportData,
        },
        {
          icon: "cloud-upload-outline",
          label: "Import Data",
          subtitle: "Restore from backup",
          type: "action",
          onPress: handleImportData,
        },
        {
          icon: "trash-outline",
          label: "Clear All Data",
          subtitle: "Delete all workouts and logs",
          type: "action",
          onPress: handleClearData,
          danger: true,
        },
      ],
    },
    {
      title: "Support",
      icon: "help-circle",
      items: [
        {
          icon: "star-outline",
          label: "Rate App",
          subtitle: "Support us with a review",
          type: "action",
          onPress: handleRateApp,
        },
        {
          icon: "share-social-outline",
          label: "Share App",
          subtitle: "Share with friends",
          type: "action",
          onPress: handleShareApp,
        },
        {
          icon: "mail-outline",
          label: "Contact Support",
          subtitle: "Get help or send feedback",
          type: "action",
          onPress: () => Alert.alert("Contact", "support@workouttracker.com"),
        },
        {
          icon: "shield-checkmark-outline",
          label: "Privacy Policy",
          subtitle: "How we handle your data",
          type: "navigation",
          onPress: () =>
            Alert.alert("Privacy Policy", "Privacy policy content"),
        },
        {
          icon: "document-text-outline",
          label: "Terms of Service",
          subtitle: "App usage terms",
          type: "navigation",
          onPress: () => Alert.alert("Terms", "Terms of service content"),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => {
    if (item.type === "toggle") {
      return (
        <View key={item.label} style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <Ionicons name={item.icon} size={22} color={Colors.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            {item.subtitle && (
              <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
            )}
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: Colors.border, true: Colors.primary + "60" }}
            thumbColor={item.value ? Colors.primary : Colors.textTertiary}
            disabled={item.disabled}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item.label}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.disabled}
      >
        <View style={styles.settingIcon}>
          <Ionicons
            name={item.icon}
            size={22}
            color={item.danger ? Colors.error : Colors.primary}
          />
        </View>
        <View style={styles.settingContent}>
          <Text
            style={[
              styles.settingLabel,
              item.danger && styles.settingLabelDanger,
            ]}
          >
            {item.label}
          </Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
        {item.type === "navigation" && (
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textTertiary}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* App Info Card */}
      <View style={styles.appInfoCard}>
        <View style={styles.appIconContainer}>
          <Ionicons name="barbell" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.appName}>Workout Tracker</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </View>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name={section.icon as any}
              size={20}
              color={Colors.primary}
            />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          <View style={styles.card}>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex}>
                {renderSettingItem(item)}
                {itemIndex !== section.items.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with 💪 by Matia</Text>
        <Text style={styles.footerSubtext}>© 2024 Workout Tracker</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  appInfoCard: {
    alignItems: "center",
    padding: 32,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    minHeight: 72,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  settingLabelDanger: {
    color: Colors.error,
  },
  settingSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 72,
  },
  footer: {
    alignItems: "center",
    padding: 32,
    paddingBottom: 48,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
