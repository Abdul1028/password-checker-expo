import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { PasswordStrengthData } from '@/utils/passwordValidation';

const { width: screenWidth } = Dimensions.get('window');

interface StrengthIndicatorProps {
  strengthData: PasswordStrengthData;
  isDark: boolean;
}

export function StrengthIndicator({ strengthData, isDark }: StrengthIndicatorProps) {
  const scaleAnim = useSharedValue(0.8);
  const rotateAnim = useSharedValue(0);

  useEffect(() => {
    scaleAnim.value = withSpring(1, { damping: 15, stiffness: 150 });
    rotateAnim.value = withSpring(strengthData.score * 72, { damping: 12, stiffness: 100 });
  }, [strengthData.score]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scaleAnim.value },
      { rotate: `${rotateAnim.value}deg` },
    ],
  }));

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.indicatorContainer}>
        <Animated.Text style={[styles.emoji, animatedStyle]}>
          {strengthData.emoji}
        </Animated.Text>
        <View style={styles.textContainer}>
          <Text style={[styles.level, isDark && styles.darkText, { color: strengthData.color }]}>
            {strengthData.level}
          </Text>
          <Text style={[styles.score, isDark && styles.darkSubtitle]}>
            {strengthData.score}/5 criteria met
          </Text>
          {strengthData.commonPattern && (
            <Text style={[styles.warning, isDark && styles.darkWarning]}>
              ⚠️ Avoid common patterns
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  darkContainer: {
    backgroundColor: '#1F2937',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: Math.min(48, screenWidth * 0.12),
    textAlign: 'center',
    minWidth: 60,
  },
  textContainer: {
    flex: 1,
  },
  level: {
    fontSize: Math.min(20, screenWidth * 0.05),
    fontWeight: '700',
    marginBottom: 4,
  },
  score: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#6B7280',
    marginBottom: 4,
  },
  darkText: {
    color: '#F9FAFB',
  },
  darkSubtitle: {
    color: '#D1D5DB',
  },
  warning: {
    fontSize: Math.min(12, screenWidth * 0.03),
    color: '#DC2626',
    fontWeight: '600',
  },
  darkWarning: {
    color: '#FCA5A5',
  },
});