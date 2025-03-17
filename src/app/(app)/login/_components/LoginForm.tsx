'use client'

import { useRouter } from 'next/navigation'
import React, { FormEvent, ReactElement, useState } from 'react'
import SubmitButton from '../../_components/SubmitButton'
import { login, LoginResponse } from '../_actions/login'
import Link from 'next/link'
import HeaderServer from '../../header/ClientHeader'
import ClientHeader from '../../header/ClientHeader'

export default function LoginForm(): ReactElement {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result: LoginResponse = await login({ email, password })

    setIsPending(false)

    if (result.success) {
      // Redirect manually after successful login
      router.push('/')
    } else {
      // Display the error message
      setError(result.error || 'فشل تسجيل الدخول')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <ClientHeader />
      <div dir="rtl" className=" flex  gap-8 min-h-full flex-col justify-center items-center">
        <div className="text-3xl" style={{ color: '#91be3f' }}>
          تسجيل الدخول
        </div>
        <div className="w-full mx-auto sm:max-w-xl">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">البريد الإلكتروني *</label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password">كلمة المرور *</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 px-3 flex items-center"
                  onClick={togglePasswordVisibility}
                  style={{ color: '#91be3f' }}
                >
                  {showPassword ? <span>إخفاء</span> : <span>عرض</span>}
                </button>
              </div>
            </div>

            {error && <div className="text-red-500 text-center">{error}</div>}

            <SubmitButton loading={isPending} text="تسجيل الدخول" />
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            ليس لديك حساب؟{' '}
            <Link
              href="/signup"
              className="font-semibold hover:underline"
              style={{ color: '#91be3f' }}
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
