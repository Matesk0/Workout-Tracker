import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

export default function SettingsScreen({ navigation }: any) {
  const settingsOptions = [
    {
      title: "Appearance",
      items: [
        {
          label: "Theme Colors",
          icon: "color-palette-outline",
          screen: "ThemeSettings",
        },
      ],
    },
    {
      title: "Account",
      items: [
        { label: "Edit Profile", icon: "person-outline", screen: null },
        { label: "Privacy", icon: "lock-closed-outline", screen: null },
      ],
    },
    {
      title: "App",
      items: [
        { label: "Notifications", icon: "notifications-outline", screen: null },
        { label: "Data & Storage", icon: "server-outline", screen: null },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {settingsOptions.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.card}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.item,
                  itemIndex !== section.items.length - 1 && styles.itemBorder,
                ]}
                onPress={() => item.screen && navigation.navigate(item.screen)}
              >
                <View style={styles.itemLeft}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={Colors.primary}
                  />
                  <Text style={styles.itemLabel}>{item.label}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  itemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemLabel: {
    fontSize: 16,
    color: Colors.text,
  },
});
