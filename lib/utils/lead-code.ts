/**
 * Generates a unique 6-character alphanumeric lead code
 * Format: A7X2K9 (uppercase letters and numbers)
 */
export function generateLeadCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

/**
 * Formats a lead code for display
 * Example: A7X2K9 -> A7X-2K9
 */
export function formatLeadCode(code: string): string {
  if (code.length !== 6) return code;
  return `${code.slice(0, 3)}-${code.slice(3)}`;
}

/**
 * Validates if a lead code has the correct format
 */
export function isValidLeadCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}
