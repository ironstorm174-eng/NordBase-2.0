import i18n from '../i18n';

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates phone numbers:
 * - Checks for non-empty string
 * - Checks allowed characters (digits, spaces, hyphens, brackets, optional '+' prefix)
 * - Checks length of digits (7 to 15 digits according to E.164 international standard)
 * - Checks for country code prefix '+' or standard digit length
 */
export function validatePhone(phoneStr: string): ValidationResult {
  const trimmed = phoneStr ? phoneStr.trim() : '';

  if (!trimmed) {
    return {
      isValid: false,
      message: i18n.t('validation.phoneEmpty', 'Please enter a contact phone number.'),
    };
  }

  // Check allowed characters: digits, spaces, hyphens, brackets, optional '+' at the start
  if (!/^\+?[0-9\s\-()]+$/.test(trimmed)) {
    return {
      isValid: false,
      message: i18n.t('validation.phoneInvalidChars', 'Phone number can only contain digits, spaces, hyphens, and an optional "+" country code.'),
    };
  }

  const digitsOnly = trimmed.replace(/[^0-9]/g, '');

  if (digitsOnly.length < 7) {
    return {
      isValid: false,
      message: i18n.t('validation.phoneTooShort', 'Phone number is too short (min 7 digits). Please include country code (e.g. +351 912 345 678).'),
    };
  }

  if (digitsOnly.length > 15) {
    return {
      isValid: false,
      message: i18n.t('validation.phoneTooLong', 'Phone number is too long (max 15 digits). Please check for typos.'),
    };
  }

  // Encourage international format if missing '+'
  if (!trimmed.startsWith('+') && digitsOnly.length <= 9) {
    return {
      isValid: false,
      message: i18n.t('validation.phoneMissingPlus', 'Please include country code starting with "+" (e.g. +351 for Portugal).'),
    };
  }

  return { isValid: true };
}

/**
 * Validates email addresses:
 * - Must contain '@'
 * - Must have valid domain suffix with dot
 */
export function validateEmail(emailStr: string): ValidationResult {
  const trimmed = emailStr ? emailStr.trim() : '';

  if (!trimmed) {
    return {
      isValid: false,
      message: i18n.t('validation.emailEmpty', 'Please enter an email address.'),
    };
  }

  if (!trimmed.includes('@')) {
    return {
      isValid: false,
      message: i18n.t('validation.emailMissingAt', 'Email address must contain "@" (e.g. user@example.com).'),
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      message: i18n.t('validation.emailInvalid', 'Please enter a valid email address format (e.g. user@example.com).'),
    };
  }

  return { isValid: true };
}

