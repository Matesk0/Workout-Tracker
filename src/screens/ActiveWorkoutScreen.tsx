import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { Workout, ActiveExercise, ExerciseSet } from "../types";
import { workoutLogStorage } from "../services/workoutLogStorage";

export default function ActiveWorkoutScreen({ route, navigation }: any) {
  const workoutParam = route.params.workout as any;
  const workout: Workout = {
    ...workoutParam,
    createdAt: new Date(workoutParam.createdAt),
    updatedAt: new Date(workoutParam.updatedAt),
  };

  const [startTime] = useState(new Date());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeExercises, setActiveExercises] = useState<ActiveExercise[]>(
    workout.exercises.map((ex) => ({
      exerciseId: ex.id,
      name: ex.name,
      plannedSets: ex.sets,
      plannedReps: ex.reps,
      plannedWeight: ex.weight,
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        reps: ex.reps,
        weight: ex.weight,
        completed: false,
      })),
    }))
  );
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(90);

  // Timer for elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rest timer countdown
  useEffect(() => {
    if (showRestTimer && restSeconds > 0) {
      const interval = setInterval(() => {
        setRestSeconds((prev) => {
          if (prev <= 1) {
            setShowRestTimer(false);
            return 90;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showRestTimer, restSeconds]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSetComplete = (exerciseIndex: number, setIndex: number) => {
    const newExercises = [...activeExercises];
    const set = newExercises[exerciseIndex].sets[setIndex];
    set.completed = !set.completed;
    setActiveExercises(newExercises);

    // Start rest timer if completing a set (not uncompleting)
    if (set.completed) {
      setShowRestTimer(true);
      setRestSeconds(90);
    }
  };

  const handleSetValueChange = (
    exerciseIndex: number,
    setIndex: number,
    field: "reps" | "weight",
    value: string
  ) => {
    const newExercises = [...activeExercises];
    const numValue = parseFloat(value) || 0;
    newExercises[exerciseIndex].sets[setIndex][field] = numValue;
    setActiveExercises(newExercises);
  };

  const handleFinishWorkout = async () => {
    const completedSets = activeExercises.reduce(
      (total, ex) => total + ex.sets.filter((s) => s.completed).length,
      0
    );

    if (completedSets === 0) {
      Alert.alert(
        "No Sets Completed",
        "You haven't completed any sets yet. Are you sure you want to finish?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Finish Anyway", onPress: saveWorkout },
        ]
      );
    } else {
      saveWorkout();
    }
  };

  const saveWorkout = async () => {
    try {
      const endTime = new Date();
      await workoutLogStorage.addWorkoutLog({
        workoutId: workout.id,
        workoutName: workout.name,
        startTime,
        endTime,
        duration: elapsedSeconds,
        exercises: activeExercises,
      });

      Alert.alert("Success", "Workout completed! 💪", [
        {
          text: "OK",
          onPress: () => navigation.navigate("WorkoutsMain"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save workout log");
    }
  };

  const handleCancelWorkout = () => {
    Alert.alert("Cancel Workout", "Are you sure? Your progress will be lost.", [
      { text: "Keep Going", style: "cancel" },
      {
        text: "Cancel Workout",
        style: "destructive",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const currentExercise = activeExercises[currentExerciseIndex];
  const totalSets = activeExercises.reduce(
    (sum, ex) => sum + ex.sets.length,
    0
  );
  const completedSets = activeExercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={handleCancelWorkout}>
            <Ionicons name="close" size={28} color={Colors.error} />
          </TouchableOpacity>
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} />
            <Text style={styles.timer}>{formatTime(elapsedSeconds)}</Text>
          </View>
          <TouchableOpacity onPress={handleFinishWorkout}>
            <Ionicons name="checkmark" size={28} color={Colors.success} />
          </TouchableOpacity>
        </View>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.progress}>
          {completedSets} / {totalSets} sets completed
        </Text>
      </View>

      {/* Exercise Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.exerciseNav}
        contentContainerStyle={styles.exerciseNavContent}
      >
        {activeExercises.map((exercise, index) => {
          const completedCount = exercise.sets.filter(
            (s) => s.completed
          ).length;
          const isActive = index === currentExerciseIndex;
          return (
            <TouchableOpacity
              key={exercise.exerciseId}
              style={[
                styles.exerciseNavItem,
                isActive && styles.exerciseNavItemActive,
              ]}
              onPress={() => setCurrentExerciseIndex(index)}
            >
              <Text
                style={[
                  styles.exerciseNavText,
                  isActive && styles.exerciseNavTextActive,
                ]}
              >
                {exercise.name}
              </Text>
              <Text style={styles.exerciseNavSets}>
                {completedCount}/{exercise.sets.length}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Current Exercise */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.currentExercise}>
          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
          <Text style={styles.exerciseTarget}>
            Target: {currentExercise.plannedSets} sets ×{" "}
            {currentExercise.plannedReps} reps
            {currentExercise.plannedWeight &&
              ` @ ${currentExercise.plannedWeight}kg`}
          </Text>
        </View>

        {/* Sets */}
        <View style={styles.setsContainer}>
          {currentExercise.sets.map((set, setIndex) => (
            <View key={setIndex} style={styles.setRow}>
              <View style={styles.setNumber}>
                <Text style={styles.setNumberText}>{set.setNumber}</Text>
              </View>

              <View style={styles.setInputs}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Reps</Text>
                  <TextInput
                    style={[
                      styles.input,
                      set.completed && styles.inputCompleted,
                    ]}
                    value={set.reps.toString()}
                    onChangeText={(value) =>
                      handleSetValueChange(
                        currentExerciseIndex,
                        setIndex,
                        "reps",
                        value
                      )
                    }
                    keyboardType="numeric"
                    editable={!set.completed}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Weight (kg)</Text>
                  <TextInput
                    style={[
                      styles.input,
                      set.completed && styles.inputCompleted,
                    ]}
                    value={set.weight?.toString() || ""}
                    onChangeText={(value) =>
                      handleSetValueChange(
                        currentExerciseIndex,
                        setIndex,
                        "weight",
                        value
                      )
                    }
                    keyboardType="decimal-pad"
                    placeholder="0"
                    placeholderTextColor={Colors.textTertiary}
                    editable={!set.completed}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.checkButton,
                  set.completed && styles.checkButtonCompleted,
                ]}
                onPress={() =>
                  handleSetComplete(currentExerciseIndex, setIndex)
                }
              >
                {set.completed ? (
                  <Ionicons name="checkmark" size={24} color={Colors.text} />
                ) : (
                  <Ionicons
                    name="checkmark"
                    size={24}
                    color={Colors.textTertiary}
                  />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {currentExerciseIndex > 0 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentExerciseIndex(currentExerciseIndex - 1)}
            >
              <Ionicons name="chevron-back" size={20} color={Colors.primary} />
              <Text style={styles.navButtonText}>Previous Exercise</Text>
            </TouchableOpacity>
          )}
          {currentExerciseIndex < activeExercises.length - 1 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentExerciseIndex(currentExerciseIndex + 1)}
            >
              <Text style={styles.navButtonText}>Next Exercise</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Rest Timer Modal */}
      <Modal visible={showRestTimer} transparent animationType="fade">
        <View style={styles.restTimerOverlay}>
          <View style={styles.restTimerCard}>
            <Text style={styles.restTimerTitle}>Rest Time</Text>
            <Text style={styles.restTimerTime}>{formatTime(restSeconds)}</Text>
            <TouchableOpacity
              style={styles.skipRestButton}
              onPress={() => setShowRestTimer(false)}
            >
              <Text style={styles.skipRestText}>Skip Rest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: Colors.backgroundElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timer: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  progress: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  exerciseNav: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  exerciseNavContent: {
    padding: 12,
    gap: 8,
  },
  exerciseNavItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseNavItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  exerciseNavText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  exerciseNavTextActive: {
    color: Colors.text,
  },
  exerciseNavSets: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  currentExercise: {
    padding: 20,
    backgroundColor: Colors.backgroundElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  exerciseName: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  exerciseTarget: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  setsContainer: {
    padding: 16,
    gap: 12,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  setNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  setNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  setInputs: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: "600",
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: Colors.text,
    fontWeight: "600",
    textAlign: "center",
  },
  inputCompleted: {
    backgroundColor: Colors.success + "20",
    borderColor: Colors.success,
  },
  checkButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkButtonCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  restTimerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
  restTimerCard: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    minWidth: 280,
  },
  restTimerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  restTimerTime: {
    fontSize: 64,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 24,
  },
  skipRestButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skipRestText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
});
