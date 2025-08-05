import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Check, X } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { PasswordStrengthData } from '@/utils/passwordValidation';

const { width: screenWidth } = Dimensions.get('window');

interface RequirementsListProps {
  strengthData: PasswordStrengthData;
  isDark: boolean;
}

export function RequirementsList({ strengthData, isDark }: RequirementsListProps) {
  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <Text style={[styles.title, isDark && styles.darkText]}>
        Password Requirements
      </Text>
      
      <View style={styles.requirementsList}>
        {strengthData.requirements.map((requirement, index) => (
          <RequirementItem
            key={requirement.name}
            requirement={requirement}
            isDark={isDark}
            index={index}
          />
        ))}
        
        {strengthData.commonPattern && (
          <RequirementItem
            requirement={{
              name: 'pattern',
              description: 'Avoid common patterns (123456, password, etc.)',
              met: false,
              regex: /./,
            }}
            isDark={isDark}
            index={strengthData.requirements.length}
          />
        )}
      </View>
    </View>
  );
}

interface RequirementItemProps {
  requirement: {
    name: string;
    description: string;
    met: boolean;
  };
  isDark: boolean;
  index: number;
}

function RequirementItem({ requirement, isDark, index }: RequirementItemProps) {
  const scaleAnim = useSharedValue(0.8);
  const opacityAnim = useSharedValue(0);

  useEffect(() => {
    const delay = index * 100;
    setTimeout(() => {
      scaleAnim.value = withSpring(1, { damping: 15, stiffness: 150 });
      opacityAnim.value = withSpring(1, { damping: 15, stiffness: 150 });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
    opacity: opacityAnim.value,
  }));

  return (
    <Animated.View
      style={[
        styles.requirementItem,
        isDark && styles.darkRequirementItem,
        animatedStyle,
      ]}>
      <View style={[
        styles.iconContainer,
        requirement.met ? styles.metIcon : styles.unmetIcon,
        isDark && !requirement.met && styles.darkUnmetIcon,
      ]}>
        {requirement.met ? (
          <Check size={14} color="#FFFFFF" strokeWidth={2.5} />
        ) : (
          <X size={14} color={isDark ? '#9CA3AF' : '#6B7280'} strokeWidth={2.5} />
        )}
      </View>
      
      <Text style={[
        styles.requirementText,
        requirement.met ? styles.metText : styles.unmetText,
        isDark && styles.darkText,
        isDark && !requirement.met && styles.darkUnmetText,
      ]}>
        {requirement.description}
      </Text>
    </Animated.View>
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
  title: {
    fontSize: Math.min(16, screenWidth * 0.04),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  darkText: {
    color: '#F9FAFB',
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    minHeight: 44,
  },
  darkRequirementItem: {
    backgroundColor: '#111827',
  },
  iconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metIcon: {
    backgroundColor: '#10B981',
  },
  unmetIcon: {
    backgroundColor: '#E5E7EB',
  },
  darkUnmetIcon: {
    backgroundColor: '#374151',
  },
  requirementText: {
    flex: 1,
    fontSize: Math.min(14, screenWidth * 0.035),
    lineHeight: 18,
  },
  metText: {
    color: '#065F46',
    fontWeight: '500',
  },
  unmetText: {
    color: '#6B7280',
  },
  darkUnmetText: {
    color: '#9CA3AF',
  },
});