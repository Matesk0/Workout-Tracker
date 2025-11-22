import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { Workout } from "../types";
import { mockWorkouts } from "../data/mockWorkouts";
import WorkoutCard from "../components/WorkoutCard";
import { workoutStorage } from "../services/workoutStorage";
import { useFocusEffect } from "@react-navigation/native";

export default function WorkoutsScreen({ navigation }: any) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      // Initialize with mock data if first time
      await workoutStorage.initializeWithMockData(mockWorkouts);
      const data = await workoutStorage.getWorkouts();
      setWorkouts(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  // Load workouts when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadWorkouts();
    }, [])
  );

  const handleWorkoutPress = (workout: Workout) => {
    navigation.navigate("WorkoutDetail", { workout });
  };

  const handleStartWorkout = (workout: Workout) => {
    navigation.navigate("ActiveWorkout", { workout });
  };

  const handleCreateWorkout = () => {
    navigation.navigate("CreateWorkout");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
      {workouts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name="barbell-outline"
            size={64}
            color={Colors.textTertiary}
          />
          <Text style={styles.emptyText}>No workouts yet</Text>
          <Text style={styles.emptySubtext}>
            Create your first workout to get started
          </Text>
        </View>
      ) : (
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
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
    textAlign: "center",
  },
});
