export const USERNAME_VALIDATION = {
  pattern: /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
  minLength: 3,
  maxLength: 30,
  message: 'Username can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen'
} as const

export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (username.length < USERNAME_VALIDATION.minLength) {
    return { 
      valid: false, 
      error: `Username must be at least ${USERNAME_VALIDATION.minLength} characters` 
    }
  }
  
  if (username.length > USERNAME_VALIDATION.maxLength) {
    return { 
      valid: false, 
      error: `Username cannot be longer than ${USERNAME_VALIDATION.maxLength} characters` 
    }
  }

  if (!USERNAME_VALIDATION.pattern.test(username)) {
    return { 
      valid: false, 
      error: USERNAME_VALIDATION.message 
    }
  }

  return { valid: true }
} 