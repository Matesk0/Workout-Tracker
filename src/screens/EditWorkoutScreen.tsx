import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { Exercise, Workout } from "../types";
import AddExerciseModal from "../components/AddExerciseModal";
import { workoutStorage } from "../services/workoutStorage";

export default function EditWorkoutScreen({ route, navigation }: any) {
  const { workout } = route.params as { workout: Workout };

  const [workoutName, setWorkoutName] = useState(workout.name);
  const [description, setDescription] = useState(workout.description || "");
  const [exercises, setExercises] = useState<Exercise[]>(workout.exercises);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAddExercise = (exercise: Omit<Exercise, "id">) => {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString(),
    };
    setExercises([...exercises, newExercise]);
  };

  const handleRemoveExercise = (id: string) => {
    Alert.alert(
      "Remove Exercise",
      "Are you sure you want to remove this exercise?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => setExercises(exercises.filter((ex) => ex.id !== id)),
        },
      ]
    );
  };

  const handleSaveWorkout = async () => {
    if (!workoutName.trim()) {
      Alert.alert("Error", "Please enter a workout name");
      return;
    }

    if (exercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise");
      return;
    }

    try {
      setSaving(true);
      await workoutStorage.updateWorkout(workout.id, {
        name: workoutName.trim(),
        description: description.trim() || undefined,
        exercises,
      });

      Alert.alert("Success", "Workout updated!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update workout. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Workout Info */}
      <View style={styles.infoSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Workout Name *</Text>
          <TextInput
            style={styles.input}
            value={workoutName}
            onChangeText={setWorkoutName}
            placeholder="e.g., Push Day"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g., Chest, Shoulders, Triceps"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>
      </View>

      {/* Exercises Header */}
      <View style={styles.exercisesHeader}>
        <Text style={styles.sectionTitle}>Exercises ({exercises.length})</Text>
        <TouchableOpacity
          style={styles.addExerciseButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={20} color={Colors.primary} />
          <Text style={styles.addExerciseText}>Add Exercise</Text>
        </TouchableOpacity>
      </View>

      {/* Exercises List */}
      {exercises.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="barbell-outline"
            size={64}
            color={Colors.textTertiary}
          />
          <Text style={styles.emptyText}>No exercises yet</Text>
          <Text style={styles.emptySubtext}>
            Tap "Add Exercise" to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseNumber}>{index + 1}</Text>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{item.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {item.sets} sets × {item.reps} reps
                    {item.weight && ` @ ${item.weight}kg`}
                  </Text>
                  {item.notes && (
                    <Text style={styles.exerciseNotes}>{item.notes}</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveExercise(item.id)}
                  style={styles.removeButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={Colors.error}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (saving || !workoutName.trim() || exercises.length === 0) &&
              styles.saveButtonDisabled,
          ]}
          onPress={handleSaveWorkout}
          disabled={saving || !workoutName.trim() || exercises.length === 0}
        >
          {saving ? (
            <ActivityIndicator color={Colors.text} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Add Exercise Modal */}
      <AddExerciseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddExercise}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  infoSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  inputGroup: {
    marginBottom: 16,
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
  exercisesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  addExerciseText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginTop: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  exerciseCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  exerciseNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    width: 28,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  exerciseNotes: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 4,
    fontStyle: "italic",
  },
  removeButton: {
    padding: 4,
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
