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

const restTimeOptions = [
  { label: "30 seconds", value: 30 },
  { label: "45 seconds", value: 45 },
  { label: "60 seconds", value: 60 },
  { label: "90 seconds", value: 90 },
  { label: "2 minutes", value: 120 },
  { label: "3 minutes", value: 180 },
  { label: "4 minutes", value: 240 },
  { label: "5 minutes", value: 300 },
];

export default function RestTimerSettingsScreen({ navigation }: any) {
  const [selectedTime, setSelectedTime] = useState(90);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    try {
      const settings = await settingsStorage.getSettings();
      setSelectedTime(settings.defaultRestTime);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleSelectTime = async (value: number) => {
    try {
      setSaving(true);
      setSelectedTime(value);
      await settingsStorage.updateSetting("defaultRestTime", value);
      setSaving(false);
    } catch (error) {
      console.error("Error saving rest time:", error);
      Alert.alert("Error", "Failed to save rest time");
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
            <Text style={styles.infoTitle}>Default Rest Time</Text>
            <Text style={styles.infoText}>
              This will be the default rest time between sets during workouts.
              You can always adjust it during your workout.
            </Text>
          </View>
        </View>

        {/* Current Selection */}
        <View style={styles.currentSelectionCard}>
          <Text style={styles.currentLabel}>Current Default</Text>
          <Text style={styles.currentValue}>
            {selectedTime >= 60
              ? `${Math.floor(selectedTime / 60)} ${
                  Math.floor(selectedTime / 60) === 1 ? "minute" : "minutes"
                }`
              : `${selectedTime} seconds`}
          </Text>
        </View>

        {/* Time Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>Select Rest Time</Text>
          <View style={styles.optionsGrid}>
            {restTimeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionCard,
                  selectedTime === option.value && styles.optionCardSelected,
                ]}
                onPress={() => handleSelectTime(option.value)}
                disabled={saving}
              >
                <View style={styles.optionContent}>
                  <Ionicons
                    name="time"
                    size={28}
                    color={
                      selectedTime === option.value
                        ? Colors.primary
                        : Colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.optionLabel,
                      selectedTime === option.value &&
                        styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
                {selectedTime === option.value && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={20} color={Colors.text} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Rest Time Guidelines</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="fitness" size={20} color={Colors.primary} />
              <Text style={styles.tipTitle}>Strength Training</Text>
            </View>
            <Text style={styles.tipText}>
              3-5 minutes for heavy compound lifts (squats, deadlifts, bench
              press)
            </Text>
          </View>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="flash" size={20} color={Colors.secondary} />
              <Text style={styles.tipTitle}>Hypertrophy</Text>
            </View>
            <Text style={styles.tipText}>
              60-90 seconds for muscle building with moderate weights
            </Text>
          </View>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="flame" size={20} color={Colors.accent} />
              <Text style={styles.tipTitle}>Endurance</Text>
            </View>
            <Text style={styles.tipText}>
              30-45 seconds for high-rep, lower weight endurance work
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
  currentSelectionCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currentLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  currentValue: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.primary,
  },
  optionsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  optionsGrid: {
    gap: 12,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  optionLabelSelected: {
    color: Colors.primary,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  tipsSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  tipCard: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  tipText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
