'use server'

import config from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { IndividualAccount } from '@/payload-types'
import { getPayload } from 'payload'

// we cannot import the type from payload/dist.../login so we define it here
export type Result = {
  exp?: number
  token?: string
  user?: IndividualAccount
}

export interface SignupResponse {
  success: boolean
  error?: string
}

interface SignupParams {
  email: string
  password: string
  fullName: string
  phone?: string
  fieldOfWork:
    | 'management'
    | 'finance'
    | 'marketing'
    | 'digital'
    | 'logistics'
    | 'hr'
    | 'production'
    | 'it'
    | 'safety'
  agreeToTerms: boolean
  marketingConsent?: boolean
}

export async function signup(params: SignupParams): Promise<SignupResponse> {
  const payload = await getPayload({ config })

  // Validate required fields
  if (!params.agreeToTerms) {
    return { success: false, error: 'You must agree to the terms and conditions' }
  }

  try {
    // Create the user with all provided data
    await payload.create({
      collection: 'individualAccount',
      data: {
        email: params.email,
        password: params.password,
        fullName: params.fullName,
        phone: params.phone || undefined,
        fieldOfWork: params.fieldOfWork,
        agreeToTerms: params.agreeToTerms,
        marketingConsent: params.marketingConsent || false,
        status: 'active',
      },
    })

    // Log the user in
    const result: Result = await payload.login({
      collection: 'individualAccount',
      data: {
        email: params.email,
        password: params.password,
      },
    })

    if (result.token) {
      const cookieStore = await cookies()
      cookieStore.set({
        name: 'payload-token',
        value: result.token,
        httpOnly: true,
        path: '/',
      })

      return { success: true }
    } else {
      console.log('Login failed: No token received')
      return { success: false, error: 'An error occurred during login' }
    }
  } catch (error: any) {
    console.log(error)

    // Provide more detailed error messages when possible
    if (error.message?.includes('duplicate key error')) {
      return { success: false, error: 'This email is already registered' }
    }

    return { success: false, error: error.message || 'An error occurred during registration' }
  }
}
