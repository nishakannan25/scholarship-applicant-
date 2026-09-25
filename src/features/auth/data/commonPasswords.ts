// Seed list of top common passwords for client-side pre-validation
export const COMMON_PASSWORDS = new Set([
  'password',
  '123456',
  '12345678',
  '123456789',
  '12345',
  '1234567890',
  'qwerty',
  'password123',
  'welcome',
  'admin',
  'letmein',
  'monkey',
  'scholarpath',
  'scholarpath123',
  'iloveyou',
  'sunshine',
  'princess',
  'dragon',
  'master',
  'access',
]);

export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.has(password.toLowerCase().trim());
}
