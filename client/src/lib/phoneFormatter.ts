// Phone number formatting patterns for different countries
const PHONE_PATTERNS: Record<string, { pattern: string; placeholder: string; maxLength: number }> = {
  US: { pattern: "(XXX) XXX-XXXX", placeholder: "(123) 456-7890", maxLength: 10 },
  CA: { pattern: "(XXX) XXX-XXXX", placeholder: "(123) 456-7890", maxLength: 10 },
  GB: { pattern: "XXXX XXX XXXX", placeholder: "1234 567 8901", maxLength: 11 },
  RU: { pattern: "(XXX) XXX-XX-XX", placeholder: "(123) 456-78-90", maxLength: 10 },
  UA: { pattern: "(XX) XXX-XX-XX", placeholder: "(12) 345-67-89", maxLength: 9 },
  DE: { pattern: "XXX XXXXXXXX", placeholder: "123 45678901", maxLength: 11 },
  FR: { pattern: "X XX XX XX XX", placeholder: "1 23 45 67 89", maxLength: 9 },
  IT: { pattern: "XXX XXXXXX", placeholder: "123 456789", maxLength: 9 },
  ES: { pattern: "XXX XX XX XX", placeholder: "123 45 67 89", maxLength: 9 },
  NL: { pattern: "XX XXXXXXXX", placeholder: "12 34567890", maxLength: 9 },
  BE: { pattern: "XXX XX XX XX", placeholder: "123 45 67 89", maxLength: 9 },
  CH: { pattern: "XX XXX XX XX", placeholder: "12 345 67 89", maxLength: 9 },
  AT: { pattern: "XXX XXXXXXX", placeholder: "123 4567890", maxLength: 10 },
  SE: { pattern: "XX XXX XX XX", placeholder: "12 345 67 89", maxLength: 9 },
  NO: { pattern: "XX XX XX XX", placeholder: "12 34 56 78", maxLength: 8 },
  DK: { pattern: "XX XX XX XX", placeholder: "12 34 56 78", maxLength: 8 },
  FI: { pattern: "XXX XXXXXXX", placeholder: "123 4567890", maxLength: 9 },
  PL: { pattern: "XXX XXX XXX", placeholder: "123 456 789", maxLength: 9 },
  CZ: { pattern: "XXX XXX XXX", placeholder: "123 456 789", maxLength: 9 },
  SK: { pattern: "XXX XXX XXX", placeholder: "123 456 789", maxLength: 9 },
  HU: { pattern: "XX XXXX XXXX", placeholder: "12 3456 7890", maxLength: 9 },
  RO: { pattern: "XXX XXX XXX", placeholder: "123 456 789", maxLength: 9 },
  BG: { pattern: "XXX XXX XXX", placeholder: "123 456 789", maxLength: 9 },
  GR: { pattern: "XXX XXXXXXX", placeholder: "123 4567890", maxLength: 10 },
  PT: { pattern: "XXX XXX XXX", placeholder: "123 456 789", maxLength: 9 },
  JP: { pattern: "XX-XXXX-XXXX", placeholder: "12-3456-7890", maxLength: 10 },
  KR: { pattern: "XXX-XXXX-XXXX", placeholder: "123-4567-8901", maxLength: 10 },
  CN: { pattern: "XXXX XXXX XXXX", placeholder: "1234 5678 9012", maxLength: 11 },
  IN: { pattern: "XXXXX XXXXX", placeholder: "12345 67890", maxLength: 10 },
  BR: { pattern: "(XX) XXXXX-XXXX", placeholder: "(12) 34567-8901", maxLength: 11 },
  MX: { pattern: "XXX XXX XXXX", placeholder: "123 456 7890", maxLength: 10 },
  ZA: { pattern: "XX XXXX XXXX", placeholder: "12 3456 7890", maxLength: 9 },
  NZ: { pattern: "XX XXXX XXXX", placeholder: "12 3456 7890", maxLength: 9 },
  SG: { pattern: "XXXX XXXX", placeholder: "1234 5678", maxLength: 8 },
  MY: { pattern: "XX-XXXX XXXX", placeholder: "12-3456 7890", maxLength: 10 },
  TH: { pattern: "XX-XXXX-XXXX", placeholder: "12-3456-7890", maxLength: 9 },
  ID: { pattern: "XXX-XXXX-XXXX", placeholder: "123-4567-8901", maxLength: 10 },
  PH: { pattern: "XXX-XXXX-XXXX", placeholder: "123-4567-8901", maxLength: 10 },
  VN: { pattern: "XXX XXXX XXXX", placeholder: "123 4567 8901", maxLength: 10 },
};

/**
 * Format phone number based on country pattern
 */
export function formatPhoneNumber(value: string, countryCode: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  
  const config = PHONE_PATTERNS[countryCode];
  if (!config) return digits; // If no pattern, return digits only
  
  // Limit to max length
  const limitedDigits = digits.slice(0, config.maxLength);
  
  // Apply pattern
  let formatted = "";
  let digitIndex = 0;
  
  for (let i = 0; i < config.pattern.length && digitIndex < limitedDigits.length; i++) {
    if (config.pattern[i] === "X") {
      formatted += limitedDigits[digitIndex];
      digitIndex++;
    } else {
      formatted += config.pattern[i];
    }
  }
  
  return formatted;
}

/**
 * Get placeholder for phone number based on country
 */
export function getPhonePlaceholder(countryCode: string): string {
  return PHONE_PATTERNS[countryCode]?.placeholder || "Phone number";
}

/**
 * Get max length for phone number based on country
 */
export function getPhoneMaxLength(countryCode: string): number {
  return PHONE_PATTERNS[countryCode]?.maxLength || 15;
}
