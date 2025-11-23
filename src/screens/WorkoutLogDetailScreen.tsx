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
import { WorkoutLog } from "../types";
import { workoutLogStorage } from "../services/workoutLogStorage";

interface WorkoutLogDetailScreenProps {
  route: any;
  navigation: any;
}

export default function WorkoutLogDetailScreen({
  route,
  navigation,
}: WorkoutLogDetailScreenProps) {
  // Deserialize dates from navigation params
  const logParam = route.params.log as any;
  const log: WorkoutLog = {
    ...logParam,
    startTime: new Date(logParam.startTime),
    endTime: new Date(logParam.endTime),
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Workout Log",
      "Are you sure you want to delete this workout log? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await workoutLogStorage.deleteWorkoutLog(log.id);
              Alert.alert("Success", "Workout log deleted", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              Alert.alert("Error", "Failed to delete workout log");
            }
          },
        },
      ]
    );
  };

  const totalSets = log.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalVolume = log.exercises.reduce(
    (acc, ex) =>
      acc +
      ex.sets
        .filter((s) => s.completed)
        .reduce((sum, s) => sum + (s.weight || 0) * s.reps, 0),
    0
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerSection}>
          <Text style={styles.workoutName}>{log.workoutName}</Text>
          <Text style={styles.date}>{formatDate(log.startTime)}</Text>
          <Text style={styles.time}>
            {formatTime(log.startTime)} - {formatTime(log.endTime)}
          </Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="time" size={24} color={Colors.primary} />
              <Text style={styles.statValue}>
                {formatDuration(log.duration)}
              </Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="fitness" size={24} color={Colors.primary} />
              <Text style={styles.statValue}>{totalSets}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="barbell" size={24} color={Colors.primary} />
              <Text style={styles.statValue}>{Math.round(totalVolume)}</Text>
              <Text style={styles.statLabel}>Volume (kg)</Text>
            </View>
          </View>
        </View>

        {/* Exercises */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {log.exercises.map((exercise, exIndex) => {
            const completedSets = exercise.sets.filter((s) => s.completed);
            if (completedSets.length === 0) return null;

            return (
              <View key={exIndex} style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.setsContainer}>
                  {completedSets.map((set, setIndex) => (
                    <View key={setIndex} style={styles.setRow}>
                      <View style={styles.setNumber}>
                        <Text style={styles.setNumberText}>
                          {set.setNumber}
                        </Text>
                      </View>
                      <View style={styles.setInfo}>
                        <View style={styles.setDetail}>
                          <Ionicons
                            name="repeat-outline"
                            size={16}
                            color={Colors.textSecondary}
                          />
                          <Text style={styles.setDetailText}>
                            {set.reps} reps
                          </Text>
                        </View>
                        {set.weight && (
                          <View style={styles.setDetail}>
                            <Ionicons
                              name="barbell-outline"
                              size={16}
                              color={Colors.textSecondary}
                            />
                            <Text style={styles.setDetailText}>
                              {set.weight} kg
                            </Text>
                          </View>
                        )}
                        {set.weight && (
                          <View style={styles.setDetail}>
                            <Text style={styles.volumeText}>
                              = {Math.round(set.reps * set.weight)} kg
                            </Text>
                          </View>
                        )}
                      </View>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={Colors.success}
                      />
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>

        {log.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{log.notes}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Delete Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
          <Text style={styles.deleteButtonText}>Delete Log</Text>
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
  date: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: Colors.textTertiary,
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
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  setsContainer: {
    gap: 8,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  setNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  setNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.success,
  },
  setInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  setDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  setDetailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  volumeText: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontStyle: "italic",
  },
  notesSection: {
    padding: 20,
    paddingTop: 0,
  },
  notesCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notesText: {
    fontSize: 14,
    color: Colors.text,
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
