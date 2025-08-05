import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { PasswordStrengthData } from '@/utils/passwordValidation';

const { width: screenWidth } = Dimensions.get('window');

interface PasswordStrengthMeterProps {
  strengthData: PasswordStrengthData;
  isDark: boolean;
}

export function PasswordStrengthMeter({ strengthData, isDark }: PasswordStrengthMeterProps) {
  const progressWidth = useSharedValue(0);
  const maxScore = 5;

  useEffect(() => {
    const percentage = (strengthData.score / maxScore) * 100;
    progressWidth.value = withTiming(percentage, { duration: 500 });
  }, [strengthData.score]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  // Generate color segments for the progress bar
  const segments = Array.from({ length: maxScore }, (_, index) => {
    let segmentColor = '#E5E7EB'; // Default gray
    
    if (index < strengthData.score) {
      if (strengthData.score <= 1) segmentColor = '#FF6B6B'; // Red
      else if (strengthData.score === 2) segmentColor = '#FFA726'; // Orange
      else if (strengthData.score === 3) segmentColor = '#FFEE58'; // Yellow
      else if (strengthData.score === 4) segmentColor = '#66BB6A'; // Light Green
      else segmentColor = '#2E7D32'; // Dark Green
    } else if (isDark) {
      segmentColor = '#374151'; // Dark gray for dark theme
    }

    return segmentColor;
  });

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.darkText]}>
          Password Strength
        </Text>
        <Text style={[styles.percentage, isDark && styles.darkSubtitle]}>
          {Math.round((strengthData.score / maxScore) * 100)}%
        </Text>
      </View>
      
      <View style={[styles.progressContainer, isDark && styles.darkProgressContainer]}>
        <View style={styles.segmentContainer}>
          {segments.map((color, index) => (
            <View
              key={index}
              style={[
                styles.segment,
                { backgroundColor: color },
                index === 0 && styles.firstSegment,
                index === segments.length - 1 && styles.lastSegment,
              ]}
            />
          ))}
        </View>
        
        <Animated.View
          style={[
            styles.progressBar,
            animatedProgressStyle,
            { backgroundColor: strengthData.color },
          ]}
        />
      </View>

      <View style={styles.labelsContainer}>
        <Text style={[styles.label, isDark && styles.darkSubtitle]}>Weak</Text>
        <Text style={[styles.label, isDark && styles.darkSubtitle]}>Strong</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#1F2937',
  },
  percentage: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '700',
    color: '#6B7280',
  },
  darkText: {
    color: '#F9FAFB',
  },
  darkSubtitle: {
    color: '#D1D5DB',
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  darkProgressContainer: {
    backgroundColor: '#374151',
  },
  segmentContainer: {
    flexDirection: 'row',
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  segment: {
    flex: 1,
    marginHorizontal: 1,
  },
  firstSegment: {
    marginLeft: 0,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  lastSegment: {
    marginRight: 0,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    position: 'absolute',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: Math.min(12, screenWidth * 0.03),
    color: '#9CA3AF',
    fontWeight: '500',
  },
});