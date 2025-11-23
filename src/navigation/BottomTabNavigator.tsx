import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

import WorkoutLogsScreen from "../screens/WorkoutLogsScreen";
import WorkoutLogDetailScreen from "../screens/WorkoutLogDetailScreen";
import WorkoutsScreen from "../screens/WorkoutsScreen";
import RecoveryScreen from "../screens/RecoveryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ThemeSettingsScreen from "../screens/ThemeSettingsScreen";
import CreateWorkoutScreen from "../screens/CreateWorkoutScreen";
import WorkoutDetailScreen from "../screens/WorkoutDetailScreen";
import EditWorkoutScreen from "../screens/EditWorkoutScreen";
import ActiveWorkoutScreen from "../screens/ActiveWorkoutScreen";
import ExerciseLibraryScreen from "../screens/ExerciseLibraryScreen";
import ExerciseDetailScreen from "../screens/ExerciseDetailScreen";
import AddCustomExerciseScreen from "../screens/AddCustomExerciseScreen";
import RestTimerSettingsScreen from "../screens/RestTimerSettingsScreen";
import UnitsSettingsScreen from "../screens/UnitsSettingsScreen";
import LanguageSettingsScreen from "../screens/LanguageSettingsScreen";
import AboutScreen from "../screens/AboutScreen";
import NavigationIconSettingsScreen from "../screens/NavigationIconSettingsScreen";

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const WorkoutsStack = createStackNavigator();
const WorkoutLogsStack = createStackNavigator();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.backgroundElevated,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.border,
        },
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 20,
          color: Colors.text,
        },
        headerTintColor: Colors.primary,
      }}
    >
      <ProfileStack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
      <ProfileStack.Screen
        name="ThemeSettings"
        component={ThemeSettingsScreen}
        options={{ title: "Theme" }}
      />
      <ProfileStack.Screen
        name="NavigationIconSettings"
        component={NavigationIconSettingsScreen}
        options={{ title: "Navigation Icons" }}
      />
      <ProfileStack.Screen
        name="RestTimerSettings"
        component={RestTimerSettingsScreen}
        options={{ title: "Rest Timer" }}
      />
      <ProfileStack.Screen
        name="UnitsSettings"
        component={UnitsSettingsScreen}
        options={{ title: "Units" }}
      />
      <ProfileStack.Screen
        name="LanguageSettings"
        component={LanguageSettingsScreen}
        options={{ title: "Language" }}
      />
      <ProfileStack.Screen
        name="ExerciseLibrary"
        component={ExerciseLibraryScreen}
        options={{ title: "Exercise Library" }}
      />
      <ProfileStack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
        options={{ title: "Exercise Details" }}
      />
      <ProfileStack.Screen
        name="AddCustomExercise"
        component={AddCustomExerciseScreen}
        options={{ title: "Add Custom Exercise" }}
      />
    </ProfileStack.Navigator>
  );
}

function WorkoutsStackNavigator() {
  return (
    <WorkoutsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.backgroundElevated,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.border,
        },
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 20,
          color: Colors.text,
        },
        headerTintColor: Colors.primary,
      }}
    >
      <WorkoutsStack.Screen
        name="WorkoutsMain"
        component={WorkoutsScreen}
        options={{ headerShown: false }}
      />
      <WorkoutsStack.Screen
        name="CreateWorkout"
        component={CreateWorkoutScreen}
        options={{ title: "Create Workout" }}
      />
      <WorkoutsStack.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{ title: "Workout Details" }}
      />
      <WorkoutsStack.Screen
        name="EditWorkout"
        component={EditWorkoutScreen}
        options={{ title: "Edit Workout" }}
      />
      <WorkoutsStack.Screen
        name="ActiveWorkout"
        component={ActiveWorkoutScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // Prevent swipe back during workout
        }}
      />
    </WorkoutsStack.Navigator>
  );
}

function WorkoutLogsStackNavigator() {
  return (
    <WorkoutLogsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.backgroundElevated,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.border,
        },
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 20,
          color: Colors.text,
        },
        headerTintColor: Colors.primary,
      }}
    >
      <WorkoutLogsStack.Screen
        name="WorkoutLogsMain"
        component={WorkoutLogsScreen}
        options={{ headerShown: false }}
      />
      <WorkoutLogsStack.Screen
        name="WorkoutLogDetail"
        component={WorkoutLogDetailScreen}
        options={{ title: "Workout Log" }}
      />
    </WorkoutLogsStack.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBarBackground,
          borderTopColor: Colors.tabBarBorder,
          borderTopWidth: 0.5,
          height: 60,
          elevation: 0,
        },
        headerStyle: {
          backgroundColor: Colors.backgroundElevated,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0.5,
          borderBottomColor: Colors.border,
        },
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 20,
          color: Colors.text,
        },
      }}
    >
      <Tab.Screen
        name="WorkoutLogs"
        component={WorkoutLogsStackNavigator} // Changed to use the stack navigator
        options={{
          title: "Logs",
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutsStackNavigator}
        options={{
          title: "Workouts",
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Recovery"
        component={RecoveryScreen}
        options={{
          title: "Recovery",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pulse-outline" size={28} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          title: "Profile",
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={28} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
