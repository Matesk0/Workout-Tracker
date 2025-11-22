import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { MuscleGroup } from "../types";
import { exerciseLibraryStorage } from "../services/exerciseLibraryStorage";

const muscleGroups: MuscleGroup[] = [
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Core",
  "Cardio",
  "Full Body",
];

export default function AddCustomExerciseScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] =
    useState<MuscleGroup>("Chest");
  const [equipment, setEquipment] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter an exercise name");
      return;
    }

    try {
      setSaving(true);
      await exerciseLibraryStorage.addCustomExercise({
        name: name.trim(),
        muscleGroup: selectedMuscleGroup,
        equipment: equipment.trim() || undefined,
        description: description.trim() || undefined,
      });

      Alert.alert("Success", "Custom exercise added!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to add exercise. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Exercise Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Exercise Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Cable Chest Press"
            placeholderTextColor={Colors.textTertiary}
            autoFocus
          />
        </View>

        {/* Muscle Group */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Muscle Group *</Text>
          <View style={styles.muscleGroupGrid}>
            {muscleGroups.map((group) => (
              <TouchableOpacity
                key={group}
                style={[
                  styles.muscleGroupChip,
                  selectedMuscleGroup === group && styles.muscleGroupChipActive,
                ]}
                onPress={() => setSelectedMuscleGroup(group)}
              >
                <Text
                  style={[
                    styles.muscleGroupChipText,
                    selectedMuscleGroup === group &&
                      styles.muscleGroupChipTextActive,
                  ]}
                >
                  {group}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Equipment */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Equipment</Text>
          <TextInput
            style={styles.input}
            value={equipment}
            onChangeText={setEquipment}
            placeholder="e.g., Cable Machine"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Optional description or instructions..."
            placeholderTextColor={Colors.textTertiary}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Info Note */}
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={Colors.primary}
          />
          <Text style={styles.infoText}>
            Custom exercises will be saved to your library and can be used in
            any workout
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (saving || !name.trim()) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving || !name.trim()}
        >
          {saving ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <Text style={styles.saveButtonText}>Add Exercise</Text>
          )}
        </TouchableOpacity>
      </View>
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
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  muscleGroupGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  muscleGroupChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  muscleGroupChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  muscleGroupChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  muscleGroupChipTextActive: {
    color: Colors.text,
  },
  infoBox: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: Colors.primary + "10",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + "30",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
});
