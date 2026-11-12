'use server'

import { AppAuthError, appAuth, type AppRole } from '@/lib/app-auth'

export type AuthResult =
  | { success: true; redirectTo: '/merchant' | '/customer' }
  | { success: false; error: string }

const cleanText = (value: unknown, maxLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

const readPassword = (value: unknown) =>
  typeof value === 'string' && value.length <= 128 ? value : ''

const isAppRole = (value: unknown): value is AppRole => value === 'merchant' || value === 'customer'

const destinationFor = (role: AppRole) => (role === 'merchant' ? '/merchant' : '/customer')

export async function loginAction(input: {
  email: string
  password: string
  role: AppRole
}): Promise<AuthResult> {
  const email = cleanText(input.email, 180).toLowerCase()
  const password = readPassword(input.password)
  const role = input.role

  if (!email.includes('@') || password.length < 8 || !isAppRole(role)) {
    return { success: false, error: 'Enter a valid email and password.' }
  }

  try {
    const user = await appAuth.login(email, password, role)
    return { success: true, redirectTo: destinationFor(user.role) }
  } catch (error) {
    if (error instanceof AppAuthError) {
      if (error.code === 'invalid-credentials') {
        return { success: false, error: 'The email or password is incorrect.' }
      }
      if (error.code === 'role-mismatch') {
        return {
          success: false,
          error: `This account is registered as a ${role === 'merchant' ? 'customer' : 'merchant'}. Choose the matching sign-in option.`,
        }
      }
      if (error.code === 'inactive-account') {
        return { success: false, error: 'This account is not active. Please contact support.' }
      }
      console.error('Cannot sign in with an invalid FairPay account.', error)
      return { success: false, error: 'This account cannot sign in. Please contact support.' }
    }

    if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      error.status === 401
    ) {
      return { success: false, error: 'The email or password is incorrect.' }
    }

    console.error('FairPay sign-in failed unexpectedly.', error)
    return { success: false, error: 'Sign-in is temporarily unavailable. Please try again.' }
  }
}

export async function signupAction(input: {
  businessName: string
  email: string
  name: string
  password: string
  role: AppRole
}): Promise<AuthResult> {
  const name = cleanText(input.name, 100)
  const businessName = cleanText(input.businessName, 120)
  const email = cleanText(input.email, 180).toLowerCase()
  const password = readPassword(input.password)
  const role = input.role

  if (!name || !email.includes('@') || password.length < 8 || !isAppRole(role)) {
    return {
      success: false,
      error: 'Complete all required fields with a valid email and password.',
    }
  }
  if (role === 'merchant' && !businessName) {
    return { success: false, error: 'Enter your business name to create a merchant account.' }
  }

  try {
    const user = await appAuth.signup({
      businessName: role === 'merchant' ? businessName : undefined,
      email,
      name,
      password,
      role,
    })
    return { success: true, redirectTo: destinationFor(user.role) }
  } catch (error) {
    if (error instanceof AppAuthError && error.code === 'email-in-use') {
      return { success: false, error: 'An account with this email already exists. Please sign in.' }
    }
    console.error('FairPay account creation or sign-in failed.', error)
    return {
      success: false,
      error: 'Could not create your account. The email may already be registered, or sign-up is temporarily unavailable.',
    }
  }
}

export async function logoutAction(): Promise<{ success: true }> {
  await appAuth.logout()
  return { success: true }
}
