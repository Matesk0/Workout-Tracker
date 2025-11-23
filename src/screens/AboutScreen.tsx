import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

export default function AboutScreen({ navigation }: any) {
  const appInfo = {
    version: "1.0.0",
    buildNumber: "100",
    releaseDate: "November 2024",
  };

  const features = [
    {
      icon: "barbell",
      title: "Workout Tracking",
      description: "Log and track your workouts",
    },
    {
      icon: "library",
      title: "Exercise Library",
      description: "50+ exercises with instructions",
    },
    {
      icon: "clipboard",
      title: "Workout History",
      description: "View all completed workouts",
    },
    {
      icon: "analytics",
      title: "Statistics",
      description: "Track progress and streaks",
    },
    {
      icon: "color-palette",
      title: "Customizable",
      description: "Personalize your theme",
    },
    {
      icon: "calendar",
      title: "Rest Timer",
      description: "Smart rest time tracking",
    },
  ];

  const links = [
    {
      icon: "globe-outline",
      title: "Website",
      url: "https://workouttracker.com",
    },
    {
      icon: "logo-github",
      title: "GitHub",
      url: "https://github.com/workouttracker",
    },
    {
      icon: "logo-twitter",
      title: "Twitter",
      url: "https://twitter.com/workouttracker",
    },
    {
      icon: "mail-outline",
      title: "Email",
      url: "mailto:support@workouttracker.com",
    },
  ];

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error("Error opening link:", error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* App Icon & Info */}
      <View style={styles.header}>
        <View style={styles.appIcon}>
          <Ionicons name="barbell" size={56} color={Colors.primary} />
        </View>
        <Text style={styles.appName}>Workout Tracker</Text>
        <Text style={styles.tagline}>Your Personal Fitness Companion</Text>

        <View style={styles.versionCard}>
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Version</Text>
            <Text style={styles.versionValue}>{appInfo.version}</Text>
          </View>
          <View style={styles.versionDivider} />
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Build</Text>
            <Text style={styles.versionValue}>{appInfo.buildNumber}</Text>
          </View>
          <View style={styles.versionDivider} />
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Release</Text>
            <Text style={styles.versionValue}>{appInfo.releaseDate}</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.description}>
          Workout Tracker is a comprehensive fitness app designed to help you
          track your workouts, monitor your progress, and achieve your fitness
          goals. Built with React Native and designed with care.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name={feature.icon as any}
                  size={24}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connect With Us</Text>
        {links.map((link, index) => (
          <TouchableOpacity
            key={index}
            style={styles.linkCard}
            onPress={() => handleOpenLink(link.url)}
          >
            <View style={styles.linkIcon}>
              <Ionicons
                name={link.icon as any}
                size={24}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.linkTitle}>{link.title}</Text>
            <Ionicons
              name="open-outline"
              size={20}
              color={Colors.textTertiary}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Credits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Credits</Text>
        <View style={styles.creditsCard}>
          <Text style={styles.creditsText}>Developed with ❤️ by Matia</Text>
          <Text style={styles.creditsSubtext}>
            Special thanks to all contributors and testers
          </Text>
        </View>
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <TouchableOpacity style={styles.legalButton}>
          <Text style={styles.legalButtonText}>Privacy Policy</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textTertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.legalButton}>
          <Text style={styles.legalButtonText}>Terms of Service</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textTertiary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.legalButton}>
          <Text style={styles.legalButtonText}>Licenses</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textTertiary}
          />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 Workout Tracker. All rights reserved.
        </Text>
      </View>
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
    padding: 32,
    paddingTop: 24,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  versionCard: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  versionRow: {
    flex: 1,
    alignItems: "center",
  },
  versionDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  versionLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  versionValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    width: "48%",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  linkTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  creditsCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  creditsText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 8,
  },
  creditsSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  legalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legalButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  footer: {
    alignItems: "center",
    padding: 32,
    paddingBottom: 48,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: "center",
  },
});
