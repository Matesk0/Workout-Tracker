import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { WorkoutLog } from "../types";
import { workoutLogStorage } from "../services/workoutLogStorage";
import { useFocusEffect } from "@react-navigation/native";

export default function WorkoutLogsScreen({ navigation }: any) {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await workoutLogStorage.getWorkoutLogs();
      setLogs(data);
    } catch (error) {
      console.error("Error loading logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadLogs();
    }, [])
  );

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      }).format(date);
    }
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

  const handleLogPress = (log: WorkoutLog) => {
    // Serialize dates before passing
    navigation.navigate("WorkoutLogDetail", {
      log: {
        ...log,
        startTime: log.startTime.toISOString(),
        endTime: log.endTime.toISOString(),
      },
    });
  };

  // Group logs by date
  const groupedLogs = logs.reduce((groups, log) => {
    const date = log.startTime.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, WorkoutLog[]>);

  const sections = Object.entries(groupedLogs).map(([date, logs]) => ({
    date: new Date(date),
    logs,
  }));

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (logs.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons
          name="clipboard-outline"
          size={64}
          color={Colors.textTertiary}
        />
        <Text style={styles.emptyText}>No workout logs yet</Text>
        <Text style={styles.emptySubtext}>
          Complete a workout to see it here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stats Header */}
      <View style={styles.statsHeader}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{logs.length}</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.round(
              logs.reduce((sum, log) => sum + log.duration, 0) / 3600
            )}
            h
          </Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {logs.reduce(
              (sum, log) =>
                sum +
                log.exercises.reduce(
                  (exSum, ex) =>
                    exSum + ex.sets.filter((s) => s.completed).length,
                  0
                ),
              0
            )}
          </Text>
          <Text style={styles.statLabel}>Total Sets</Text>
        </View>
      </View>

      {/* Logs List */}
      <FlatList
        data={sections}
        keyExtractor={(item) => item.date.toISOString()}
        renderItem={({ item: section }) => (
          <View style={styles.section}>
            <Text style={styles.sectionDate}>{formatDate(section.date)}</Text>
            {section.logs.map((log) => {
              const completedSets = log.exercises.reduce(
                (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
                0
              );
              const totalVolume = log.exercises.reduce(
                (sum, ex) =>
                  sum +
                  ex.sets
                    .filter((s) => s.completed)
                    .reduce(
                      (setSum, s) => setSum + (s.weight || 0) * s.reps,
                      0
                    ),
                0
              );

              return (
                <TouchableOpacity
                  key={log.id}
                  style={styles.logCard}
                  onPress={() => handleLogPress(log)}
                  activeOpacity={0.7}
                >
                  <View style={styles.logHeader}>
                    <View style={styles.logTitleContainer}>
                      <Text style={styles.logName}>{log.workoutName}</Text>
                      <Text style={styles.logTime}>
                        {formatTime(log.startTime)}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={Colors.textTertiary}
                    />
                  </View>
                  <View style={styles.logStats}>
                    <View style={styles.logStat}>
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.logStatText}>
                        {formatDuration(log.duration)}
                      </Text>
                    </View>
                    <View style={styles.logStat}>
                      <Ionicons
                        name="fitness-outline"
                        size={16}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.logStatText}>
                        {completedSets} sets
                      </Text>
                    </View>
                    {totalVolume > 0 && (
                      <View style={styles.logStat}>
                        <Ionicons
                          name="barbell-outline"
                          size={16}
                          color={Colors.textSecondary}
                        />
                        <Text style={styles.logStatText}>
                          {Math.round(totalVolume)} kg
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
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
  statsHeader: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionDate: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  logCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  logTitleContainer: {
    flex: 1,
  },
  logName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  logTime: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  logStats: {
    flexDirection: "row",
    gap: 16,
  },
  logStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logStatText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
