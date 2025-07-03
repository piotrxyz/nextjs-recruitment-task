export function isValidCountryCode(code: string): boolean {
  return /^[A-Z]{3}$/.test(code)
}

export function normalizeCountryCode(code: string): string {
  return code.toUpperCase().trim()
}
