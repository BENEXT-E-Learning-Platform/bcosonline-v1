'use client'

import { useRouter } from 'next/navigation'
import { useState, FormEvent, ReactElement, Suspense } from 'react'
import Link from 'next/link'
import { signup, SignupResponse } from '../_actions/signup'
import SubmitButton from '../../_components/SubmitButton'

export default function SignupForm(): ReactElement {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setIsPending(true)
    setError(null) // Reset error state

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string
    const fieldOfWork = formData.get('fieldOfWork') as
      | 'management'
      | 'finance'
      | 'marketing'
      | 'digital'
      | 'logistics'
      | 'hr'
      | 'production'
      | 'it'
      | 'safety'
    const agreeToTerms = formData.get('agreeToTerms') === 'on'
    const marketingConsent = formData.get('marketingConsent') === 'on'

    // Validate form
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      setIsPending(false)
      return
    }

    if (!agreeToTerms) {
      setError('يجب الموافقة على الشروط والأحكام')
      setIsPending(false)
      return
    }

    // Submit form
    const result: SignupResponse = await signup({
      email,
      password,
      fullName,
      phone,
      fieldOfWork,
      agreeToTerms,
      marketingConsent,
    })

    setIsPending(false)

    if (result.success) {
      // Redirect to dashboard after successful signup
      router.push('/')
    } else {
      // Display the error message
      setError(result.error || 'فشل التسجيل')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <Suspense>
      <div dir="rtl" className="flex gap-8 min-h-full flex-col justify-center items-center">
        <div className="text-3xl" style={{ color: '#91be3f' }}>
          سجل الآن في الدورة
        </div>
        <div className="w-full mx-auto sm:max-w-xl">
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="fullName">الاسم الكامل *</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

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
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword">تأكيد كلمة المرور *</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 px-3 flex items-center"
                    onClick={toggleConfirmPasswordVisibility}
                    style={{ color: '#91be3f' }}
                  >
                    {showConfirmPassword ? <span>إخفاء</span> : <span>عرض</span>}
                  </button>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="phone">رقم الهاتف</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="fieldOfWork">مجال عملك و خبرتك *</label>
                <select
                  id="fieldOfWork"
                  name="fieldOfWork"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">اختر مجال عملك</option>
                  <option value="management">الإدارة والتسيير / La gestion</option>
                  <option value="finance">
                    المالية والمحاسبة والجباية / Finance & Comptabilité & Fiscalité
                  </option>
                  <option value="marketing">التسويق والمبيعات / Marketing & Commercial</option>
                  <option value="digital">الديجيتال / Digital</option>
                  <option value="logistics">
                    التموين واللوجيستيك / Approvisionnement & Logistique
                  </option>
                  <option value="hr">الموارد البشرية / Ressources humaines</option>
                  <option value="production">الإنتاج والعمليات / Production & Processus</option>
                  <option value="it">نظام المعلومات / IT</option>
                  <option value="safety">الوقاية والأمن / HSE</option>
                </select>
              </div>
            </div>

            {/* Terms and Marketing Consent */}
            <div className="space-y-4 mt-4">
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  className="h-4 w-4 mt-1 mx-2"
                  required
                />
                <label htmlFor="agreeToTerms" className="text-sm">
                  نعم ، لقد قرأتُ الشروط والأحكام المتعلقة باستخدام المنصة الرقمية وأوافق عليها *
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="marketingConsent"
                  name="marketingConsent"
                  type="checkbox"
                  className="h-4 w-4 mt-1 mx-2"
                />
                <label htmlFor="marketingConsent" className="text-sm">
                  نعم ، أرغب باستمرار متابعة جديد الأخبار وأحدث العروض الترويجية عبر رسائل البريد
                  الإلكتروني و الواتساب (اختياري)
                </label>
              </div>
            </div>

            {error && <div className="text-red-500 text-center">{error}</div>}

            <SubmitButton loading={isPending} text="تسجيل" />
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            لديك حساب بالفعل؟{' '}
            <Link
              href="/login"
              className="font-semibold hover:underline"
              style={{ color: '#91be3f' }}
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </Suspense>
  )
}
