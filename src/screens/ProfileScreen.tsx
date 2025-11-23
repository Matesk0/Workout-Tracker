import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { workoutLogStorage } from "../services/workoutLogStorage";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_NAME_KEY = "@user_name";

export default function ProfileScreen({ navigation }: any) {
  const [userName, setUserName] = useState("Athlete");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [tempName, setTempName] = useState("");

  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalHours: 0,
    totalSets: 0,
    currentStreak: 0,
    longestStreak: 0,
    thisWeekWorkouts: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      loadUserName();
      calculateStats();
    }, [])
  );

  const loadUserName = async () => {
    try {
      const name = await AsyncStorage.getItem(USER_NAME_KEY);
      if (name) setUserName(name);
    } catch (error) {
      console.error("Error loading username:", error);
    }
  };

  const saveUserName = async () => {
    if (!tempName.trim()) {
      Alert.alert("Error", "Please enter a name");
      return;
    }
    try {
      await AsyncStorage.setItem(USER_NAME_KEY, tempName.trim());
      setUserName(tempName.trim());
      setEditModalVisible(false);
      setTempName("");
    } catch (error) {
      Alert.alert("Error", "Failed to save name");
    }
  };

  const handleEditProfile = () => {
    setTempName(userName);
    setEditModalVisible(true);
  };

  const calculateStats = async () => {
    try {
      const logs = await workoutLogStorage.getWorkoutLogs();

      const totalWorkouts = logs.length;
      const totalSeconds = logs.reduce((sum, log) => sum + log.duration, 0);
      const totalHours = Math.round(totalSeconds / 3600);
      const totalSets = logs.reduce(
        (sum, log) =>
          sum +
          log.exercises.reduce(
            (exSum, ex) => exSum + ex.sets.filter((s) => s.completed).length,
            0
          ),
        0
      );

      const sortedLogs = logs.sort(
        (a, b) => b.startTime.getTime() - a.startTime.getTime()
      );
      const { current, longest } = calculateStreaks(sortedLogs);

      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const thisWeekWorkouts = logs.filter(
        (log) => log.startTime >= startOfWeek
      ).length;

      setStats({
        totalWorkouts,
        totalHours,
        totalSets,
        currentStreak: current,
        longestStreak: longest,
        thisWeekWorkouts,
      });
    } catch (error) {
      console.error("Error calculating stats:", error);
    }
  };

  const calculateStreaks = (sortedLogs: any[]) => {
    if (sortedLogs.length === 0) return { current: 0, longest: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let checkDate = new Date(today);

    for (const log of sortedLogs) {
      const logDate = new Date(log.startTime);
      logDate.setHours(0, 0, 0, 0);

      if (logDate.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (logDate.getTime() < checkDate.getTime()) {
        const daysDiff = Math.floor(
          (checkDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysDiff > 1) break;
        checkDate = new Date(logDate);
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    const uniqueDates = [
      ...new Set(
        sortedLogs.map((log) => {
          const d = new Date(log.startTime);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      ),
    ].sort((a, b) => b - a);

    if (uniqueDates.length > 0) {
      tempStreak = 1;
      longestStreak = 1;

      for (let i = 1; i < uniqueDates.length; i++) {
        const daysDiff =
          (uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24);
        if (daysDiff === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }
    }

    return { current: currentStreak, longest: longestStreak };
  };

  const menuItems = [
    {
      icon: "barbell-outline",
      title: "Exercise Library",
      subtitle: "Browse and manage exercises",
      color: Colors.primary,
      onPress: () => navigation.navigate("ExerciseLibrary"),
    },
    {
      icon: "body-outline",
      title: "Body Stats",
      subtitle: "Track weight and measurements",
      color: Colors.secondary,
      onPress: () => Alert.alert("Coming Soon", "Body stats tracking feature"),
    },
    {
      icon: "trophy-outline",
      title: "Personal Records",
      subtitle: "View your best lifts",
      color: "#FFD700",
      onPress: () => Alert.alert("Coming Soon", "Personal records feature"),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Ionicons name="person" size={48} color={Colors.textSecondary} />
          </View>
          <View style={styles.editBadge}>
            <Ionicons name="camera" size={16} color={Colors.text} />
          </View>
        </TouchableOpacity>

        <Text style={styles.username}>{userName}</Text>
        <Text style={styles.localBadge}>Local Profile</Text>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={handleEditProfile}
        >
          <Ionicons name="create-outline" size={18} color={Colors.primary} />
          <Text style={styles.editProfileText}>Edit Name</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>

        {/* Main Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={styles.statIconContainer}>
              <Ionicons name="barbell" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total Workouts</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.statValue}>{stats.totalHours}h</Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statIconContainer}>
              <Ionicons name="fitness" size={24} color={Colors.accent} />
            </View>
            <Text style={styles.statValue}>{stats.totalSets}</Text>
            <Text style={styles.statLabel}>Total Sets</Text>
          </View>
        </View>

        {/* Streak Cards */}
        <View style={styles.streakContainer}>
          <View style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <Ionicons name="flame" size={28} color="#FF6B35" />
              <View style={styles.streakInfo}>
                <Text style={styles.streakValue}>{stats.currentStreak}</Text>
                <Text style={styles.streakLabel}>Day Streak</Text>
              </View>
            </View>
            <Text style={styles.streakSubtext}>
              {stats.currentStreak > 0
                ? `Keep it up! ${stats.currentStreak} day${
                    stats.currentStreak > 1 ? "s" : ""
                  } in a row`
                : "Start your streak today!"}
            </Text>
          </View>

          <View style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <Ionicons name="calendar" size={28} color={Colors.primary} />
              <View style={styles.streakInfo}>
                <Text style={styles.streakValue}>{stats.thisWeekWorkouts}</Text>
                <Text style={styles.streakLabel}>This Week</Text>
              </View>
            </View>
            <Text style={styles.streakSubtext}>
              {stats.thisWeekWorkouts > 0
                ? `${7 - stats.thisWeekWorkouts} day${
                    7 - stats.thisWeekWorkouts > 1 ? "s" : ""
                  } left this week`
                : "No workouts yet this week"}
            </Text>
          </View>
        </View>

        {/* Best Streak */}
        {stats.longestStreak > 0 && (
          <View style={styles.bestStreakCard}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <View style={styles.bestStreakInfo}>
              <Text style={styles.bestStreakLabel}>Longest Streak</Text>
              <Text style={styles.bestStreakValue}>
                {stats.longestStreak} days
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Features</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View
              style={[styles.menuIcon, { backgroundColor: item.color + "20" }]}
            >
              <Ionicons name={item.icon as any} size={24} color={item.color} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textTertiary}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("Settings")}
        >
          <View
            style={[
              styles.menuIcon,
              { backgroundColor: Colors.textSecondary + "20" },
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={Colors.textSecondary}
            />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Settings</Text>
            <Text style={styles.menuSubtitle}>App preferences and theme</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textTertiary}
          />
        </TouchableOpacity>
      </View>

      {/* Footer Spacing */}
      <View style={styles.footer} />

      {/* Edit Name Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile Name</Text>
            <TextInput
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Enter your name"
              placeholderTextColor={Colors.textTertiary}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setEditModalVisible(false);
                  setTempName("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveUserName}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.backgroundElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.border,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.backgroundElevated,
  },
  username: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  localBadge: {
    fontSize: 12,
    color: Colors.textTertiary,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  statsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
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
  streakContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  streakCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  streakInfo: {
    flex: 1,
  },
  streakValue: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    lineHeight: 32,
  },
  streakLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  streakSubtext: {
    fontSize: 12,
    color: Colors.textTertiary,
    lineHeight: 16,
  },
  bestStreakCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bestStreakInfo: {
    flex: 1,
  },
  bestStreakLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  bestStreakValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  menuSection: {
    padding: 20,
    paddingTop: 0,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  settingsSection: {
    padding: 20,
    paddingTop: 0,
  },
  footer: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  saveButton: {
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.background,
  },
});
