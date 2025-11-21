import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { Workout } from "../types";

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
  onStart: () => void;
}

export default function WorkoutCard({
  workout,
  onPress,
  onStart,
}: WorkoutCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{workout.name}</Text>
          {workout.description && (
            <Text style={styles.description}>{workout.description}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.startButton}
          onPress={(e) => {
            e.stopPropagation();
            onStart();
          }}
        >
          <Ionicons name="play" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons
            name="barbell-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <Text style={styles.statText}>
            {workout.exercises.length} exercises
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons
            name="time-outline"
            size={16}
            color={Colors.textSecondary}
          />
          <Text style={styles.statText}>
            ~{workout.exercises.reduce((acc, ex) => acc + ex.sets, 0)} sets
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  startButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  stats: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
