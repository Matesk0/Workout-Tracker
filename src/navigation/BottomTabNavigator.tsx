import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

import WorkoutLogsScreen from "../screens/WorkoutLogsScreen";
import WorkoutsScreen from "../screens/WorkoutsScreen";
import RecoveryScreen from "../screens/RecoveryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ThemeSettingsScreen from "../screens/ThemeSettingsScreen";
import CreateWorkoutScreen from "../screens/CreateWorkoutScreen";

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();
const WorkoutsStack = createStackNavigator();

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
        options={{ title: "Theme Colors" }}
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
    </WorkoutsStack.Navigator>
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
        component={WorkoutLogsScreen}
        options={{
          title: "Logs",
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
