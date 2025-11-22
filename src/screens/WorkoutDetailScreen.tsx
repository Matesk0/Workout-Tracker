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
import { Workout } from "../types";
import { workoutStorage } from "../services/workoutStorage";

interface WorkoutDetailScreenProps {
  route: any;
  navigation: any;
}

export default function WorkoutDetailScreen({
  route,
  navigation,
}: WorkoutDetailScreenProps) {
  const { workout } = route.params as { workout: Workout };

  const handleEdit = () => {
    navigation.navigate("EditWorkout", { workout });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Workout",
      `Are you sure you want to delete "${workout.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await workoutStorage.deleteWorkout(workout.id);
              Alert.alert("Success", "Workout deleted", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert("Error", "Failed to delete workout");
            }
          },
        },
      ]
    );
  };

  const handleStart = () => {
    navigation.navigate("ActiveWorkout", { workout });
  };

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const totalReps = workout.exercises.reduce(
    (acc, ex) => acc + ex.sets * ex.reps,
    0
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerSection}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          {workout.description && (
            <Text style={styles.description}>{workout.description}</Text>
          )}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="barbell" size={24} color={Colors.primary} />
              <Text style={styles.statValue}>{workout.exercises.length}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="fitness" size={24} color={Colors.primary} />
              <Text style={styles.statValue}>{totalSets}</Text>
              <Text style={styles.statLabel}>Total Sets</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="repeat" size={24} color={Colors.primary} />
              <Text style={styles.statValue}>{totalReps}</Text>
              <Text style={styles.statLabel}>Total Reps</Text>
            </View>
          </View>
        </View>

        {/* Exercises List */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {workout.exercises.map((exercise, index) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.exerciseDetails}>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="layers-outline"
                        size={16}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.detailText}>
                        {exercise.sets} sets
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons
                        name="repeat-outline"
                        size={16}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.detailText}>
                        {exercise.reps} reps
                      </Text>
                    </View>
                    {exercise.weight && (
                      <View style={styles.detailItem}>
                        <Ionicons
                          name="barbell-outline"
                          size={16}
                          color={Colors.textSecondary}
                        />
                        <Text style={styles.detailText}>
                          {exercise.weight} kg
                        </Text>
                      </View>
                    )}
                  </View>
                  {exercise.notes && (
                    <View style={styles.notesContainer}>
                      <Ionicons
                        name="information-circle-outline"
                        size={16}
                        color={Colors.textTertiary}
                      />
                      <Text style={styles.notesText}>{exercise.notes}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color={Colors.text} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Ionicons name="play" size={20} color={Colors.text} />
          <Text style={styles.startButtonText}>Start Workout</Text>
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
  },
  headerSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  workoutName: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  statBox: {
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  exercisesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
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
    gap: 12,
  },
  exerciseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  notesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 8,
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  notesText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textTertiary,
    fontStyle: "italic",
  },
  actionsContainer: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: 32,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
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
  startButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
});
