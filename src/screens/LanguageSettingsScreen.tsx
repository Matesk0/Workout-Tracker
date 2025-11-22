import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { settingsStorage } from "../services/settingsStorage";
import { useFocusEffect } from "@react-navigation/native";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  available: boolean;
}

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    available: true,
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    available: false,
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    available: false,
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    available: false,
  },
  {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    flag: "🇮🇹",
    available: false,
  },
  {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    flag: "🇵🇹",
    available: false,
  },
  {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    flag: "🇷🇺",
    available: false,
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    flag: "🇨🇳",
    available: false,
  },
  {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    available: false,
  },
  {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    available: false,
  },
];

export default function LanguageSettingsScreen({ navigation }: any) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    try {
      const settings = await settingsStorage.getSettings();
      setSelectedLanguage(settings.language);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleSelectLanguage = async (code: string, available: boolean) => {
    if (!available) {
      Alert.alert(
        "Coming Soon",
        "This language is not yet available. We're working on adding more languages!"
      );
      return;
    }

    try {
      setSaving(true);
      setSelectedLanguage(code);
      await settingsStorage.updateSetting("language", code);
      setSaving(false);
      Alert.alert("Language Changed", "The app language has been updated.");
    } catch (error) {
      console.error("Error saving language:", error);
      Alert.alert("Error", "Failed to save language preference");
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle"
            size={24}
            color={Colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>App Language</Text>
            <Text style={styles.infoText}>
              Choose your preferred language. The app will restart to apply the
              changes.
            </Text>
          </View>
        </View>

        {/* Available Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available</Text>
          {languages
            .filter((lang) => lang.available)
            .map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageCard,
                  selectedLanguage === language.code &&
                    styles.languageCardSelected,
                ]}
                onPress={() =>
                  handleSelectLanguage(language.code, language.available)
                }
                disabled={saving}
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text
                    style={[
                      styles.languageName,
                      selectedLanguage === language.code &&
                        styles.languageNameSelected,
                    ]}
                  >
                    {language.name}
                  </Text>
                  <Text style={styles.languageNative}>
                    {language.nativeName}
                  </Text>
                </View>
                {selectedLanguage === language.code && (
                  <Ionicons
                    name="checkmark-circle"
                    size={28}
                    color={Colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
        </View>

        {/* Coming Soon Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          {languages
            .filter((lang) => !lang.available)
            .map((language) => (
              <TouchableOpacity
                key={language.code}
                style={styles.languageCard}
                onPress={() =>
                  handleSelectLanguage(language.code, language.available)
                }
              >
                <Text style={styles.languageFlag}>{language.flag}</Text>
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{language.name}</Text>
                  <Text style={styles.languageNative}>
                    {language.nativeName}
                  </Text>
                </View>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Soon</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Help Translation */}
        <View style={styles.helpCard}>
          <Ionicons name="language" size={32} color={Colors.primary} />
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Help Us Translate</Text>
            <Text style={styles.helpText}>
              Want to help translate the app to your language? Contact us and
              join our translation community!
            </Text>
            <TouchableOpacity style={styles.helpButton}>
              <Text style={styles.helpButtonText}>Get Involved</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  infoCard: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: Colors.primary + "10",
    padding: 20,
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary + "30",
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    opacity: 0.8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  languageCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  languageCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 16,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  languageNameSelected: {
    color: Colors.primary,
  },
  languageNative: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  comingSoonBadge: {
    backgroundColor: Colors.textTertiary + "30",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  helpCard: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: Colors.card,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
});
