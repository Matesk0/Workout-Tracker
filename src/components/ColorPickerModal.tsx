import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { Colors } from "../constants/colors";

interface ColorPickerModalProps {
  visible: boolean;
  currentColor: string;
  colorLabel: string;
  onClose: () => void;
  onSelectColor: (color: string) => void;
}

const { width } = Dimensions.get("window");

export default function ColorPickerModal({
  visible,
  currentColor,
  colorLabel,
  onClose,
  onSelectColor,
}: ColorPickerModalProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);

  const handleConfirm = () => {
    onSelectColor(selectedColor);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Pick Color</Text>
            <Text style={styles.subtitle}>{colorLabel}</Text>
          </View>

          {/* Color Preview */}
          <View style={styles.previewContainer}>
            <View style={styles.previewRow}>
              <View style={styles.previewBox}>
                <View
                  style={[
                    styles.colorPreview,
                    { backgroundColor: currentColor },
                  ]}
                />
                <Text style={styles.previewLabel}>Current</Text>
              </View>
              <View style={styles.previewBox}>
                <View
                  style={[
                    styles.colorPreview,
                    { backgroundColor: selectedColor },
                  ]}
                />
                <Text style={styles.previewLabel}>New</Text>
              </View>
            </View>
            <Text style={styles.hexValue}>{selectedColor.toUpperCase()}</Text>
          </View>

          {/* Color Picker */}
          <View style={styles.pickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor}
              onColorChangeComplete={setSelectedColor}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              row={false}
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  previewContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    marginBottom: 16,
  },
  previewBox: {
    alignItems: "center",
    gap: 8,
  },
  colorPreview: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  previewLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  hexValue: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    fontFamily: "monospace",
    fontWeight: "600",
  },
  pickerContainer: {
    paddingHorizontal: 24,
    height: 300,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
});
