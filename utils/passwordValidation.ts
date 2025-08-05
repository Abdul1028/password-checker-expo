export interface PasswordRequirement {
  name: string;
  regex: RegExp;
  description: string;
  met: boolean;
}

export interface PasswordStrengthData {
  score: number;
  level: string;
  emoji: string;
  color: string;
  requirements: PasswordRequirement[];
  commonPattern: boolean;
}

// Common weak password patterns to avoid
const COMMON_PATTERNS = [
  '123456',
  'password',
  '123456789',
  '12345678',
  '12345',
  '1234567',
  '1234567890',
  'qwerty',
  'abc123',
  'million2',
  '000000',
  '1234',
  'iloveyou',
  'aaron431',
  'password1',
  'qqww1122',
  '123',
  'omgpop',
  '123321',
  '654321',
  'qwertyuiop',
  'qwer1234',
  'admin',
  'Password',
  'QWERTY',
  '1q2w3e4r',
  'welcome',
  'monkey',
  'dragon',
  'letmein',
  'master',
  'sunshine',
  'princess',
  'azerty',
  'trustno1',
];

/**
 * Validates password strength using comprehensive regex patterns
 * @param password - The password string to validate
 * @returns PasswordStrengthData object with score, level, and requirements
 */
export function validatePassword(password: string): PasswordStrengthData {
  // Define password requirements with regex patterns
  const requirements: PasswordRequirement[] = [
    {
      name: 'length',
      regex: /.{8,}/, // At least 8 characters
      description: 'At least 8 characters',
      met: false,
    },
    {
      name: 'uppercase',
      regex: /[A-Z]/, // At least one uppercase letter
      description: 'One uppercase letter (A-Z)',
      met: false,
    },
    {
      name: 'lowercase',
      regex: /[a-z]/, // At least one lowercase letter
      description: 'One lowercase letter (a-z)',
      met: false,
    },
    {
      name: 'numbers',
      regex: /[0-9]/, // At least one number
      description: 'One number (0-9)',
      met: false,
    },
    {
      name: 'special',
      regex: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/, // At least one special character
      description: 'One special character (!@#$%...)',
      met: false,
    },
  ];

  // Check each requirement against the password
  requirements.forEach((requirement) => {
    requirement.met = requirement.regex.test(password);
  });

  // Calculate score based on met requirements
  const score = requirements.filter((req) => req.met).length;

  // Check for common weak patterns
  const lowerPassword = password.toLowerCase();
  const commonPattern = COMMON_PATTERNS.some(
    (pattern) =>
      lowerPassword.includes(pattern.toLowerCase()) ||
      lowerPassword === pattern.toLowerCase()
  );

  // Additional security checks for repetitive patterns
  const hasRepetitiveChars = /(.)\1{2,}/.test(password); // Three or more consecutive identical characters
  const hasSequentialChars = 
    /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password);

  // Adjust score based on pattern detection
  let adjustedScore = score;
  if (commonPattern || hasRepetitiveChars || hasSequentialChars) {
    adjustedScore = Math.max(0, adjustedScore - 1);
  }

  // Determine strength level based on adjusted score
  let level: string;
  let emoji: string;
  let color: string;

  if (adjustedScore <= 1) {
    level = 'Very Weak';
    emoji = '👎';
    color = '#FF6B6B'; // Red
  } else if (adjustedScore === 2) {
    level = 'Weak';
    emoji = '✋';
    color = '#FFA726'; // Orange
  } else if (adjustedScore === 3) {
    level = 'Medium';
    emoji = '👌';
    color = '#FFEE58'; // Yellow
  } else if (adjustedScore === 4) {
    level = 'Strong';
    emoji = '👍';
    color = '#66BB6A'; // Light Green
  } else {
    level = 'Very Strong';
    emoji = '🤘';
    color = '#2E7D32'; // Dark Green
  }

  return {
    score: adjustedScore,
    level,
    emoji,
    color,
    requirements,
    commonPattern: commonPattern || hasRepetitiveChars || hasSequentialChars,
  };
}

/**
 * Generates a secure random password based on given criteria
 * @param length - Desired password length (minimum 8)
 * @param includeSymbols - Whether to include special characters
 * @returns Generated secure password string
 */
export function generateSecurePassword(
  length: number = 12,
  includeSymbols: boolean = true
): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let charset = lowercase + uppercase + numbers;
  if (includeSymbols) {
    charset += symbols;
  }

  let password = '';
  
  // Ensure at least one character from each required set
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  
  if (includeSymbols) {
    password += symbols[Math.floor(Math.random() * symbols.length)];
  }

  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password to avoid predictable patterns
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}