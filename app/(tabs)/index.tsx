import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  Alert,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, X, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter';
import { StrengthIndicator } from '@/components/StrengthIndicator';
import { RequirementsList } from '@/components/RequirementsList';
import { validatePassword } from '@/utils/passwordValidation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PasswordChecker() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const strengthData = validatePassword(password);
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);

  useEffect(() => {
    if (password.length > 0) {
      fadeAnim.value = withTiming(1, { duration: 300 });
      scaleAnim.value = withSpring(1, { damping: 15, stiffness: 150 });
    } else {
      fadeAnim.value = withTiming(0, { duration: 300 });
      scaleAnim.value = withTiming(0.8, { duration: 300 });
    }
  }, [password]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: scaleAnim.value }],
  }));

  const handleCopyPassword = async () => {
    if (password) {
      await Clipboard.setStringAsync(password);
      Alert.alert('Copied!', 'Password copied to clipboard');
    }
  };

  const clearPassword = () => {
    setPassword('');
  };

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <LinearGradient
        colors={
          isDark
            ? ['#1F2937', '#111827', '#000000']
            : ['#F3F4F6', '#E5E7EB', '#D1D5DB']
        }
        style={styles.gradient}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          
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
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, isDark && styles.darkText]}>
                Password Strength Checker
              </Text>
              <Text style={[styles.subtitle, isDark && styles.darkSubtitle]}>
                Create a secure password with real-time feedback
              </Text>
            </View>

            {/* Password Input Section */}
            <View style={[styles.inputSection, isDark && styles.darkInputSection]}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.textInput, isDark && styles.darkTextInput]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                
                <View style={styles.inputButtons}>
                  {password.length > 0 && (
                    <TouchableOpacity
                      onPress={clearPassword}
                      style={styles.iconButton}>
                      <X size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.iconButton}>
                    {showPassword ? (
                      <EyeOff size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    ) : (
                      <Eye size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    )}
                  </TouchableOpacity>
                  
                  {password.length > 0 && (
                    <TouchableOpacity
                      onPress={handleCopyPassword}
                      style={styles.iconButton}>
                      <Copy size={20} color={isDark ? '#60A5FA' : '#3B82F6'} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>


            {/* Strength Indicators */}
            {password.length > 0 && (
              <Animated.View style={[styles.strengthSection, animatedStyle]}>
                <StrengthIndicator strengthData={strengthData} isDark={isDark} />
                <PasswordStrengthMeter strengthData={strengthData} isDark={isDark} />
                <RequirementsList strengthData={strengthData} isDark={isDark} />
              </Animated.View>
            )}

            {/* Tips Section */}
            <View style={[styles.tipsSection, isDark && styles.darkTipsSection]}>
              <Text style={[styles.tipsTitle, isDark && styles.darkText]}>
                💡 Password Tips
              </Text>
              <Text style={[styles.tipsText, isDark && styles.darkSubtitle]}>
                • Use at least 8 characters{'\n'}
                • Mix uppercase and lowercase letters{'\n'}
                • Include numbers and special characters{'\n'}
                • Avoid common patterns like "123456"{'\n'}
                • Don't use personal information
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
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
  subtitle: {
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  darkText: {
    color: '#F9FAFB',
  },
  darkSubtitle: {
    color: '#D1D5DB',
  },
  inputSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  darkInputSection: {
    backgroundColor: '#1F2937',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 56,
  },
  textInput: {
    flex: 1,
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#1F2937',
    paddingVertical: 16,
    fontFamily: 'monospace',
  },
  darkTextInput: {
    color: '#F9FAFB',
    borderColor: '#374151',
  },
  inputButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strengthSection: {
    gap: 12,
    marginBottom: 20,
  },
  tipsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  darkTipsSection: {
    backgroundColor: '#1F2937',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  tipsTitle: {
    fontSize: Math.min(18, screenWidth * 0.045),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#6B7280',
    lineHeight: 20,
  },
});