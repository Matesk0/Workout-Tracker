import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../constants/colors";
import { colorSettings } from "../types/theme";
import ColorPickerModal from "../components/ColorPickerModal";

export default function ThemeSettingsScreen() {
  const [colors, setColors] = useState(Colors);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedColorKey, setSelectedColorKey] = useState<
    keyof typeof Colors | null
  >(null);
  const [selectedColorLabel, setSelectedColorLabel] = useState("");

  const openColorPicker = (key: keyof typeof Colors, label: string) => {
    setSelectedColorKey(key);
    setSelectedColorLabel(label);
    setModalVisible(true);
  };

  const updateColor = (color: string) => {
    if (selectedColorKey) {
      setColors({ ...colors, [selectedColorKey]: color });
    }
  };

  const groupedSettings = colorSettings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, typeof colorSettings>);

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Customize your theme colors</Text>
          <Text style={styles.headerSubtext}>Tap any color to change it</Text>
        </View>

        {Object.entries(groupedSettings).map(([category, settings]) => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>
            <View style={styles.card}>
              {settings.map((setting, index) => (
                <TouchableOpacity
                  key={setting.key}
                  style={[
                    styles.colorItem,
                    index !== settings.length - 1 && styles.itemBorder,
                  ]}
                  onPress={() => openColorPicker(setting.key, setting.label)}
                >
                  <View style={styles.colorInfo}>
                    <Text style={styles.colorLabel}>{setting.label}</Text>
                    <View style={styles.colorValueContainer}>
                      <View
                        style={[
                          styles.colorPreview,
                          { backgroundColor: colors[setting.key] },
                        ]}
                      />
                      <Text style={styles.colorValue}>
                        {colors[setting.key].toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => setColors(Colors)}
          >
            <Text style={styles.resetButtonText}>Reset to Default</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ColorPickerModal
        visible={modalVisible}
        currentColor={selectedColorKey ? colors[selectedColorKey] : "#000000"}
        colorLabel={selectedColorLabel}
        onClose={() => setModalVisible(false)}
        onSelectColor={updateColor}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 8,
  },
  headerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  headerSubtext: {
    fontSize: 12,
    color: Colors.textTertiary,
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
  colorItem: {
    padding: 16,
  },
  itemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  colorInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colorLabel: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: "500",
  },
  colorValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  colorPreview: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  colorValue: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontFamily: "monospace",
    minWidth: 70,
  },
  footer: {
    padding: 16,
    paddingTop: 32,
    paddingBottom: 48,
  },
  resetButton: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
