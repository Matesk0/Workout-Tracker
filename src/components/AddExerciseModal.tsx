import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { Exercise } from "../types";

interface AddExerciseModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (exercise: Omit<Exercise, "id">) => void;
  onBrowseLibrary: () => void;
}

export default function AddExerciseModal({
  visible,
  onClose,
  onAdd,
  onBrowseLibrary,
}: AddExerciseModalProps) {
  const [name, setName] = useState("");
  const [sets, setSets] = useState("3");
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    if (!name.trim()) {
      return;
    }

    onAdd({
      name: name.trim(),
      sets: parseInt(sets) || 3,
      reps: parseInt(reps) || 10,
      weight: weight ? parseFloat(weight) : undefined,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setName("");
    setSets("3");
    setReps("10");
    setWeight("");
    setNotes("");
    onClose();
  };

  const handleBrowseLibrary = () => {
    onClose();
    onBrowseLibrary();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Add Exercise</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Browse Library Button */}
          <TouchableOpacity
            style={styles.libraryButton}
            onPress={handleBrowseLibrary}
          >
            <Ionicons name="library-outline" size={20} color={Colors.primary} />
            <Text style={styles.libraryButtonText}>
              Browse Exercise Library
            </Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or add manually</Text>
            <View style={styles.dividerLine} />
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Exercise Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Exercise Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Bench Press"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>

            {/* Sets and Reps */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Sets</Text>
                <TextInput
                  style={styles.input}
                  value={sets}
                  onChangeText={setSets}
                  keyboardType="numeric"
                  placeholder="3"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Reps</Text>
                <TextInput
                  style={styles.input}
                  value={reps}
                  onChangeText={setReps}
                  keyboardType="numeric"
                  placeholder="10"
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            </View>

            {/* Weight */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                placeholder="Optional"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Optional notes..."
                placeholderTextColor={Colors.textTertiary}
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          {/* Add Button */}
          <TouchableOpacity
            style={[styles.addButton, !name.trim() && styles.addButtonDisabled]}
            onPress={handleAdd}
            disabled={!name.trim()}
          >
            <Text style={styles.addButtonText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: Colors.backgroundElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  libraryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.primary + "20",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  libraryButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginLeft: 12,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 16,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  form: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  addButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonDisabled: {
    backgroundColor: Colors.textTertiary,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
});
