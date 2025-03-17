import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import ClientHeader from './header/ClientHeader'

export default function Page() {
  return (
    <div className="flex flex-col w-full" dir="rtl">
      <ClientHeader />

      {/* Hero Section */}
      <section className="bg-[#253b74] text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">تعلم مهارات المستقبل</h1>
              <p className="text-xl mb-6">
                دورات تفاعلية مصممة لمساعدتك على إتقان التقنيات الجديدة بالوتيرة الخاصة بك.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/courses"
                  className="px-6 py-3 bg-[#91be3f] text-white font-bold rounded hover:bg-opacity-90 transition"
                >
                  استكشاف الدورات
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-3 border-2 border-white rounded font-bold hover:bg-white hover:text-[#253b74] transition"
                >
                  التسجيل مجانًا
                </Link>
              </div>
            </div>
            <div className="flex-1">
              <div className="relative h-64 w-full md:h-80">
                <Image
                  src="/api/placeholder/500/400"
                  alt="الطلاب يتعلمون عبر الإنترنت"
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#253b74]">
            لماذا تختار منصتنا؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-[#253b74] rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  width="24"
                  height="24"
                >
                  <path d="M12 6.253v13h-1.25v-13H12zm1.25 17v-4h-2.5v4h2.5zM12 3.25a.75.75 0 010 1.5.75.75 0 010-1.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#253b74]">دورات يقودها خبراء</h3>
              <p className="text-gray-600">تعلم من محترفين في الصناعة ذوي خبرة عملية حقيقية.</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-[#91be3f] rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  width="24"
                  height="24"
                >
                  <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#253b74]">تعلم وفقًا لوتيرتك</h3>
              <p className="text-gray-600">
                الوصول إلى المواد الدراسية في أي وقت وأي مكان، مع وصول مدى الحياة.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-[#253b74] rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  width="24"
                  height="24"
                >
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#253b74]">دعم المجتمع</h3>
              <p className="text-gray-600">
                انضم إلى شبكة من المتعلمين واحصل على المساعدة عندما تحتاجها.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#253b74]">الدورات الشائعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
              >
                <div className="relative h-48">
                  <Image
                    src="/api/placeholder/400/300"
                    alt={`دورة ${item}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium px-2 py-1 bg-[#91be3f] text-white rounded">
                      الأكثر مبيعاً
                    </span>
                    <span className="text-[#253b74] font-bold">49.99$</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-[#253b74]">معسكر تطوير الويب</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    تعلم تطوير الويب الحديث من الصفر مع مشاريع عملية.
                  </p>
                  <Link
                    href="/courses/web-development"
                    className="text-[#253b74] font-bold hover:underline"
                  >
                    اعرف المزيد ←
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/courses"
              className="px-6 py-3 bg-[#253b74] text-white font-bold rounded hover:bg-opacity-90 transition"
            >
              عرض جميع الدورات
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#253b74]">ماذا يقول طلابنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border border-gray-200 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <h4 className="font-bold">أحمد محمد</h4>
                  <p className="text-sm text-gray-500">مطور ويب</p>
                </div>
                <div className="w-12 h-12 bg-[#253b74] rounded-full flex items-center justify-center text-white font-bold">
                  أ م
                </div>
              </div>
              <p className="text-gray-600">
                غيرت هذه المنصة مسار حياتي المهنية تمامًا. الدورات منظمة بشكل جيد والمدربون على
                دراية وداعمين.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <h4 className="font-bold">سارة أحمد</h4>
                  <p className="text-sm text-gray-500">مصممة تجربة المستخدم</p>
                </div>
                <div className="w-12 h-12 bg-[#91be3f] rounded-full flex items-center justify-center text-white font-bold">
                  س أ
                </div>
              </div>
              <p className="text-gray-600">
                الجانب المجتمعي لهذه المنصة يميزها عن غيرها. القدرة على التواصل مع المتعلمين الآخرين
                عززت تجربة التعلم بشكل كبير.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-[#253b74] text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">ابدأ رحلة التعلم اليوم</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            انضم إلى آلاف الطلاب الذين يتعلمون بالفعل على منصتنا.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 bg-[#91be3f] text-white font-bold rounded hover:bg-opacity-90 transition"
            >
              ابدأ مجانًا
            </Link>
            <Link
              href="/courses"
              className="px-6 py-3 border-2 border-white rounded font-bold hover:bg-white hover:text-[#253b74] transition"
            >
              تصفح الدورات
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 bg-gray-800 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">تعلم</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/courses" className="hover:text-[#91be3f]">
                    جميع الدورات
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-[#91be3f]">
                    التسعير
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-[#91be3f]">
                    المدونة
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">الشركة</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-[#91be3f]">
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#91be3f]">
                    اتصل بنا
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-[#91be3f]">
                    وظائف
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">الدعم</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="hover:text-[#91be3f]">
                    الأسئلة الشائعة
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-[#91be3f]">
                    مركز المساعدة
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-[#91be3f]">
                    المجتمع
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">تواصل معنا</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span>+123 456 7890</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                  <span>info@example.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-700">
            <p className="text-gray-400">&copy; ٢٠٢٥ جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
