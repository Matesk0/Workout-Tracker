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
import { settingsStorage } from "../services/settingsStorage";
import { useFocusEffect } from "@react-navigation/native";

type UnitSystem = "metric" | "imperial";

const unitOptions = [
  {
    system: "metric" as UnitSystem,
    title: "Metric",
    subtitle: "Kilograms (kg) & Centimeters (cm)",
    icon: "globe-outline",
    examples: [
      { label: "Weight", value: "80 kg" },
      { label: "Height", value: "175 cm" },
      { label: "Distance", value: "5 km" },
    ],
  },
  {
    system: "imperial" as UnitSystem,
    title: "Imperial",
    subtitle: "Pounds (lbs) & Inches (in)",
    icon: "flag-outline",
    examples: [
      { label: "Weight", value: "176 lbs" },
      { label: "Height", value: "5'9\"" },
      { label: "Distance", value: "3.1 mi" },
    ],
  },
];

export default function UnitsSettingsScreen({ navigation }: any) {
  const [selectedUnit, setSelectedUnit] = useState<UnitSystem>("metric");
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    try {
      const settings = await settingsStorage.getSettings();
      setSelectedUnit(settings.units);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleSelectUnit = async (system: UnitSystem) => {
    try {
      setSaving(true);
      setSelectedUnit(system);
      await settingsStorage.updateSetting("units", system);
      setSaving(false);
      Alert.alert(
        "Units Changed",
        `All measurements will now be displayed in ${
          system === "metric" ? "metric" : "imperial"
        } units.`
      );
    } catch (error) {
      console.error("Error saving units:", error);
      Alert.alert("Error", "Failed to save units preference");
      setSaving(false);
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
            <Text style={styles.infoTitle}>Measurement Units</Text>
            <Text style={styles.infoText}>
              Choose your preferred measurement system. This will affect weight,
              distance, and body measurements throughout the app.
            </Text>
          </View>
        </View>

        {/* Unit Options */}
        <View style={styles.optionsSection}>
          {unitOptions.map((option) => (
            <TouchableOpacity
              key={option.system}
              style={[
                styles.unitCard,
                selectedUnit === option.system && styles.unitCardSelected,
              ]}
              onPress={() => handleSelectUnit(option.system)}
              disabled={saving}
            >
              {/* Header */}
              <View style={styles.unitHeader}>
                <View style={styles.unitIconContainer}>
                  <Ionicons
                    name={option.icon as any}
                    size={32}
                    color={
                      selectedUnit === option.system
                        ? Colors.primary
                        : Colors.textSecondary
                    }
                  />
                </View>
                <View style={styles.unitInfo}>
                  <Text
                    style={[
                      styles.unitTitle,
                      selectedUnit === option.system &&
                        styles.unitTitleSelected,
                    ]}
                  >
                    {option.title}
                  </Text>
                  <Text style={styles.unitSubtitle}>{option.subtitle}</Text>
                </View>
                {selectedUnit === option.system && (
                  <View style={styles.checkmark}>
                    <Ionicons
                      name="checkmark-circle"
                      size={28}
                      color={Colors.primary}
                    />
                  </View>
                )}
              </View>

              {/* Examples */}
              <View style={styles.examplesContainer}>
                <Text style={styles.examplesTitle}>Examples:</Text>
                <View style={styles.examplesGrid}>
                  {option.examples.map((example, index) => (
                    <View key={index} style={styles.exampleItem}>
                      <Text style={styles.exampleLabel}>{example.label}</Text>
                      <Text style={styles.exampleValue}>{example.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conversion Info */}
        <View style={styles.conversionSection}>
          <Text style={styles.sectionTitle}>Quick Conversions</Text>
          <View style={styles.conversionCard}>
            <View style={styles.conversionRow}>
              <Text style={styles.conversionLabel}>1 kg</Text>
              <Ionicons
                name="swap-horizontal"
                size={16}
                color={Colors.textTertiary}
              />
              <Text style={styles.conversionValue}>≈ 2.2 lbs</Text>
            </View>
            <View style={styles.conversionDivider} />
            <View style={styles.conversionRow}>
              <Text style={styles.conversionLabel}>1 lb</Text>
              <Ionicons
                name="swap-horizontal"
                size={16}
                color={Colors.textTertiary}
              />
              <Text style={styles.conversionValue}>≈ 0.45 kg</Text>
            </View>
            <View style={styles.conversionDivider} />
            <View style={styles.conversionRow}>
              <Text style={styles.conversionLabel}>1 cm</Text>
              <Ionicons
                name="swap-horizontal"
                size={16}
                color={Colors.textTertiary}
              />
              <Text style={styles.conversionValue}>≈ 0.39 in</Text>
            </View>
            <View style={styles.conversionDivider} />
            <View style={styles.conversionRow}>
              <Text style={styles.conversionLabel}>1 in</Text>
              <Ionicons
                name="swap-horizontal"
                size={16}
                color={Colors.textTertiary}
              />
              <Text style={styles.conversionValue}>≈ 2.54 cm</Text>
            </View>
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
  optionsSection: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  unitCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  unitCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  unitHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  unitIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  unitInfo: {
    flex: 1,
  },
  unitTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  unitTitleSelected: {
    color: Colors.primary,
  },
  unitSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  checkmark: {
    marginLeft: 12,
  },
  examplesContainer: {
    backgroundColor: Colors.background,
    padding: 16,
    borderRadius: 12,
  },
  examplesTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  examplesGrid: {
    flexDirection: "row",
    gap: 12,
  },
  exampleItem: {
    flex: 1,
    alignItems: "center",
  },
  exampleLabel: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  exampleValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  conversionSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  conversionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  conversionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  conversionDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  conversionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    flex: 1,
  },
  conversionValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
    flex: 1,
    textAlign: "right",
  },
});
