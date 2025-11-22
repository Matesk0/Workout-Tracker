import React from "react";
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
import { LibraryExercise } from "../types";
import { exerciseLibraryStorage } from "../services/exerciseLibraryStorage";

interface ExerciseDetailScreenProps {
  route: any;
  navigation: any;
}

export default function ExerciseDetailScreen({
  route,
  navigation,
}: ExerciseDetailScreenProps) {
  const { exercise } = route.params as { exercise: LibraryExercise };

  const handleDelete = () => {
    if (!exercise.isCustom) {
      Alert.alert("Cannot Delete", "Default exercises cannot be deleted");
      return;
    }

    Alert.alert(
      "Delete Exercise",
      `Are you sure you want to delete "${exercise.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await exerciseLibraryStorage.deleteExercise(exercise.id);
              Alert.alert("Success", "Exercise deleted", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert("Error", "Failed to delete exercise");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="barbell" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          {exercise.isCustom && (
            <View style={styles.customBadge}>
              <Text style={styles.customBadgeText}>Custom Exercise</Text>
            </View>
          )}
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons
                name="body-outline"
                size={20}
                color={Colors.textSecondary}
              />
              <Text style={styles.infoLabel}>Muscle Group</Text>
            </View>
            <Text style={styles.infoValue}>{exercise.muscleGroup}</Text>
          </View>

          {exercise.equipment && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons
                  name="construct-outline"
                  size={20}
                  color={Colors.textSecondary}
                />
                <Text style={styles.infoLabel}>Equipment</Text>
              </View>
              <Text style={styles.infoValue}>{exercise.equipment}</Text>
            </View>
          )}

          {exercise.description && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={Colors.textSecondary}
                />
                <Text style={styles.infoLabel}>Description</Text>
              </View>
              <Text style={styles.descriptionText}>{exercise.description}</Text>
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Exercise Tips</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.success}
              />
              <Text style={styles.tipTitle}>Proper Form</Text>
            </View>
            <Text style={styles.tipText}>
              Focus on controlled movements and proper form over heavy weight
            </Text>
          </View>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="time" size={20} color={Colors.primary} />
              <Text style={styles.tipTitle}>Rest Time</Text>
            </View>
            <Text style={styles.tipText}>
              Rest 60-90 seconds between sets for optimal recovery
            </Text>
          </View>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="water" size={20} color={Colors.secondary} />
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
            </View>
            <Text style={styles.tipText}>
              Keep water nearby and hydrate between sets
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      {exercise.isCustom && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
            <Text style={styles.deleteButtonText}>Delete Exercise</Text>
          </TouchableOpacity>
        </View>
      )}
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
  header: {
    alignItems: "center",
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  customBadge: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  customBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  infoSection: {
    padding: 20,
    gap: 12,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  descriptionText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  tipsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  footer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.error,
    padding: 14,
    borderRadius: 12,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.error,
  },
});
