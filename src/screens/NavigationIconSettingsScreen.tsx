import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import {
  navigationIconsStorage,
  NavigationIcons,
  LucideIconName,
  AvailableIcons,
} from "../services/navigationIconsStorage";
import { useFocusEffect } from "@react-navigation/native";

export default function NavigationIconSettingsScreen({ navigation }: any) {
  const [icons, setIcons] = useState<NavigationIcons>({
    workoutLogs: "ClipboardList",
    workouts: "Dumbbell",
    recovery: "Activity",
    profile: "User",
  });
  const [selectedTab, setSelectedTab] =
    useState<keyof NavigationIcons>("workoutLogs");

  useFocusEffect(
    React.useCallback(() => {
      loadIcons();
    }, [])
  );

  const loadIcons = async () => {
    try {
      const savedIcons = await navigationIconsStorage.getIcons();
      setIcons(savedIcons);
    } catch (error) {
      console.error("Error loading icons:", error);
    }
  };

  const handleSelectIcon = async (icon: LucideIconName) => {
    try {
      const newIcons = { ...icons, [selectedTab]: icon };
      setIcons(newIcons);
      await navigationIconsStorage.updateIcon(selectedTab, icon);
      Alert.alert("Icon Updated", "Please restart the app to see the changes.");
    } catch (error) {
      Alert.alert("Error", "Failed to save icon");
    }
  };

  const handleResetToDefault = async () => {
    Alert.alert("Reset Icons", "Reset all navigation icons to default?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        onPress: async () => {
          try {
            await navigationIconsStorage.resetToDefault();
            await loadIcons();
            Alert.alert(
              "Success",
              "Icons reset to default. Please restart the app."
            );
          } catch (error) {
            Alert.alert("Error", "Failed to reset icons");
          }
        },
      },
    ]);
  };

  const tabs = [
    { key: "workoutLogs" as keyof NavigationIcons, label: "Logs" },
    { key: "workouts" as keyof NavigationIcons, label: "Workouts" },
    { key: "recovery" as keyof NavigationIcons, label: "Recovery" },
    { key: "profile" as keyof NavigationIcons, label: "Profile" },
  ];

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
            <Text style={styles.infoTitle}>Customize Navigation Icons</Text>
            <Text style={styles.infoText}>
              Select a tab below, then choose an icon for it. Changes require an
              app restart.
            </Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Tab</Text>
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabCard,
                  selectedTab === tab.key && styles.tabCardActive,
                ]}
                onPress={() => setSelectedTab(tab.key)}
              >
                <Ionicons
                  name="apps"
                  size={32}
                  color={
                    selectedTab === tab.key
                      ? Colors.primary
                      : Colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabLabel,
                    selectedTab === tab.key && styles.tabLabelActive,
                  ]}
                >
                  {tab.label}
                </Text>
                <Text style={styles.currentIcon}>{icons[tab.key]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Icon Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Choose Icon for {tabs.find((t) => t.key === selectedTab)?.label}
          </Text>
          <View style={styles.iconsGrid}>
            {AvailableIcons.map((iconOption) => (
              <TouchableOpacity
                key={iconOption.name}
                style={[
                  styles.iconCard,
                  icons[selectedTab] === iconOption.name &&
                    styles.iconCardActive,
                ]}
                onPress={() => handleSelectIcon(iconOption.name)}
              >
                <Ionicons
                  name="apps"
                  size={32}
                  color={
                    icons[selectedTab] === iconOption.name
                      ? Colors.primary
                      : Colors.textSecondary
                  }
                />
                <Text style={styles.iconLabel}>{iconOption.label}</Text>
                {icons[selectedTab] === iconOption.name && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark" size={16} color={Colors.text} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reset Button */}
        <View style={styles.resetSection}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetToDefault}
          >
            <Ionicons name="refresh" size={20} color={Colors.primary} />
            <Text style={styles.resetButtonText}>Reset to Default</Text>
          </TouchableOpacity>
        </View>

        {/* Note */}
        <View style={styles.noteCard}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={Colors.textTertiary}
          />
          <Text style={styles.noteText}>
            Changes will take effect after restarting the app
          </Text>
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tabCard: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  tabCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 8,
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  currentIcon: {
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  iconsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  iconCard: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.border,
    position: "relative",
  },
  iconCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  iconLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  resetSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  noteCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: Colors.card,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textTertiary,
    lineHeight: 18,
  },
});
