import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function About() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <LinearGradient
        colors={
          isDark
            ? ['#1F2937', '#111827', '#000000']
            : ['#F3F4F6', '#E5E7EB', '#D1D5DB']
        }
        style={styles.gradient}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContainer,
            { 
              paddingTop: insets.top + 10,
              paddingBottom: Math.max(insets.bottom + 20, 100),
              minHeight: screenHeight - insets.top - insets.bottom,
            }
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}>
          
          <View style={styles.header}>
            <Text style={[styles.title, isDark && styles.darkText]}>
              About Password Checker
            </Text>
            <Text style={[styles.version, isDark && styles.darkSubtitle]}>
              Version 1.0.0
            </Text>
          </View>

          <View style={[styles.section, isDark && styles.darkSection]}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
              🔐 Features
            </Text>
            <Text style={[styles.sectionText, isDark && styles.darkSubtitle]}>
              • Real-time password strength validation{'\n'}
              • Visual strength indicators with emojis{'\n'}
              • Color-coded progress bars{'\n'}
              • Show/hide password toggle{'\n'}
              • Copy to clipboard functionality{'\n'}
              • Dark/light theme support{'\n'}
              • Responsive design for all devices
            </Text>
          </View>

          <View style={[styles.section, isDark && styles.darkSection]}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
              🛡️ Security Criteria
            </Text>
            <Text style={[styles.sectionText, isDark && styles.darkSubtitle]}>
              Our password checker evaluates:{'\n\n'}
              • Minimum 8 characters length{'\n'}
              • At least one uppercase letter (A-Z){'\n'}
              • At least one lowercase letter (a-z){'\n'}
              • At least one number (0-9){'\n'}
              • At least one special character{'\n'}
              • Avoids common weak patterns
            </Text>
          </View>

          <View style={[styles.section, isDark && styles.darkSection]}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
              📊 Strength Levels
            </Text>
            <Text style={[styles.sectionText, isDark && styles.darkSubtitle]}>
              👎 Very Weak - 0-1 criteria met{'\n'}
              ✋ Weak - 2 criteria met{'\n'}
              👌 Medium - 3 criteria met{'\n'}
              👍 Strong - 4 criteria met{'\n'}
              🤘 Very Strong - 5+ criteria met
            </Text>
          </View>

          <View style={[styles.section, isDark && styles.darkSection]}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
              🚀 Built With
            </Text>
            <Text style={[styles.sectionText, isDark && styles.darkSubtitle]}>
              • React Native & Expo{'\n'}
              • TypeScript for type safety{'\n'}
              • React Native Reanimated for smooth animations{'\n'}
              • Expo Linear Gradient for beautiful backgrounds{'\n'}
              • Lucide React Native for icons
            </Text>
          </View>

          <Text style={[styles.footer, isDark && styles.darkSubtitle]}>
            Made with ❤️ for secure passwords
          </Text>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: Math.min(28, screenWidth * 0.07),
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  version: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#6B7280',
    textAlign: 'center',
  },
  darkText: {
    color: '#F9FAFB',
  },
  darkSubtitle: {
    color: '#D1D5DB',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  darkSection: {
    backgroundColor: '#1F2937',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  sectionTitle: {
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    marginBottom: 20,
  },
});