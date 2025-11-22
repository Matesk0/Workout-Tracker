import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { LibraryExercise, MuscleGroup } from "../types";
import { exerciseLibraryStorage } from "../services/exerciseLibraryStorage";
import { useFocusEffect } from "@react-navigation/native";

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

const muscleGroupIcons: Record<MuscleGroup, string> = {
  Chest: "body-outline",
  Back: "body-outline",
  Shoulders: "body-outline",
  Arms: "hand-right-outline",
  Legs: "walk-outline",
  Core: "fitness-outline",
  Cardio: "heart-outline",
  "Full Body": "body",
};

export default function ExerciseLibraryScreen({ navigation, route }: any) {
  const [exercises, setExercises] = useState<LibraryExercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<LibraryExercise[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<
    MuscleGroup | "All"
  >("All");

  // Check if we're in selection mode (from create/edit workout)
  const selectionMode = route.params?.selectionMode || false;
  const onSelectExercise = route.params?.onSelectExercise;

  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await exerciseLibraryStorage.getExercises();
      setExercises(data);
      setFilteredExercises(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load exercises");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadExercises();
    }, [])
  );

  React.useEffect(() => {
    filterExercises();
  }, [searchQuery, selectedMuscleGroup, exercises]);

  const filterExercises = () => {
    let filtered = exercises;

    // Filter by muscle group
    if (selectedMuscleGroup !== "All") {
      filtered = filtered.filter(
        (ex) => ex.muscleGroup === selectedMuscleGroup
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ex) =>
          ex.name.toLowerCase().includes(query) ||
          ex.muscleGroup.toLowerCase().includes(query) ||
          ex.equipment?.toLowerCase().includes(query)
      );
    }

    setFilteredExercises(filtered);
  };

  const handleExercisePress = (exercise: LibraryExercise) => {
    if (selectionMode && onSelectExercise) {
      onSelectExercise(exercise);
      navigation.goBack();
    } else {
      navigation.navigate("ExerciseDetail", { exercise });
    }
  };

  const handleAddCustomExercise = () => {
    navigation.navigate("AddCustomExercise");
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
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search exercises..."
          placeholderTextColor={Colors.textTertiary}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Muscle Group Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={["All", ...muscleGroups]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedMuscleGroup === item && styles.filterChipActive,
              ]}
              onPress={() =>
                setSelectedMuscleGroup(item as MuscleGroup | "All")
              }
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedMuscleGroup === item && styles.filterChipTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* Exercise List */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseCard}
            onPress={() => handleExercisePress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.exerciseIcon}>
              <Ionicons
                name={muscleGroupIcons[item.muscleGroup] as any}
                size={24}
                color={Colors.primary}
              />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <View style={styles.exerciseMeta}>
                <Text style={styles.exerciseMetaText}>{item.muscleGroup}</Text>
                {item.equipment && (
                  <>
                    <Text style={styles.exerciseMetaDot}>•</Text>
                    <Text style={styles.exerciseMetaText}>
                      {item.equipment}
                    </Text>
                  </>
                )}
                {item.isCustom && (
                  <>
                    <Text style={styles.exerciseMetaDot}>•</Text>
                    <Text style={styles.customBadge}>Custom</Text>
                  </>
                )}
              </View>
            </View>
            <Ionicons
              name={selectionMode ? "add-circle" : "chevron-forward"}
              size={24}
              color={selectionMode ? Colors.primary : Colors.textTertiary}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color={Colors.textTertiary} />
            <Text style={styles.emptyText}>No exercises found</Text>
            <Text style={styles.emptySubtext}>
              Try a different search or filter
            </Text>
          </View>
        }
      />

      {/* Add Custom Exercise Button */}
      {!selectionMode && (
        <TouchableOpacity style={styles.fab} onPress={handleAddCustomExercise}>
          <Ionicons name="add" size={28} color={Colors.text} />
        </TouchableOpacity>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  filterContainer: {
    marginBottom: 12,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.text,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
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
  exerciseMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  exerciseMetaText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  exerciseMetaDot: {
    fontSize: 13,
    color: Colors.textTertiary,
  },
  customBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
