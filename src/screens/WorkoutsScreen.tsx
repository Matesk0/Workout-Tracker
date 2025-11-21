import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { Workout } from "../types";
import { mockWorkouts } from "../data/mockWorkouts";
import WorkoutCard from "../components/WorkoutCard";

export default function WorkoutsScreen({ navigation }: any) {
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);

  const handleWorkoutPress = (workout: Workout) => {
    // TODO: Navigate to workout detail screen
    Alert.alert("View Workout", `Opening details for: ${workout.name}`);
  };

  const handleStartWorkout = (workout: Workout) => {
    // TODO: Navigate to active workout screen
    Alert.alert("Start Workout", `Starting: ${workout.name}`);
  };

  const handleCreateWorkout = () => {
    navigation.navigate("CreateWorkout");
  };

  return (
    <View style={styles.container}>
      {/* Header with Create Button */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Workouts</Text>
          <Text style={styles.subtitle}>
            {workouts.length} workout templates
          </Text>
        </View>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateWorkout}
        >
          <Ionicons name="add" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Workouts List */}
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onPress={() => handleWorkoutPress(item)}
            onStart={() => handleStartWorkout(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  createButton: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
});
