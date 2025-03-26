'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'

interface Consultant {
  id: number
  name: string
  role: string
  description: string
  image: string
}

export default function ConsultantsCarousel() {
  // Sample consultant data
  const consultants: Consultant[] = [
    {
      id: 1,
      name: "عمر محرزي",
      role: "دكتوراه في مجال المالية",
      description: "دكتوراه في مجال المالية من جامعة Grenoble الفرنسية، مكون في المالية للآثار من 10 سنوات",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    },
    {
      id: 2,
      name: "عبد الله الحاج الناصر",
      role: "مستشار ومكون في المالية",
      description: "مستشار ومكون في المالية للآثار من 17 سنة، مسؤول مشاريع المرافقة بمؤسسة Bcos",
      image: "https://images.unsplash.com/photo-1542178243-bc20204b769f"
    },
    {
      id: 3,
      name: "توفيق طلبي",
      role: "مدير تنفيذي",
      description: "مدير تنفيذي لدى Hive Digit، خبرة في الموارد البشرية لأزيد من 15 سنة، مستشار لدى مؤسسة Bcos",
      image: "https://images.unsplash.com/photo-1651684215020-f7a5b6610f23"
    },
    {
      id: 4,
      name: "محمد أمين",
      role: "خبير في التسويق الرقمي",
      description: "خبير في التسويق الرقمي والتجارة الإلكترونية، مكون معتمد لدى مؤسسة Bcos من 8 سنوات",
      image: "https://plus.unsplash.com/premium_photo-1689708721750-8a0e6dc14cee"
    },
    {
      id: 5,
      name: "سارة عبد الرحمن",
      role: "مستشارة في إدارة المشاريع",
      description: "مستشارة في إدارة المشاريع وريادة الأعمال، خبرة أكثر من 12 سنة في مرافقة المشاريع الناشئة",
      image: "https://plus.unsplash.com/premium_photo-1661746531825-1589a93f9415"
    }
  ]

  return (
    <section className="relative py-16 bg-gradient-to-b from-white to-[#f0f4f8]">
      {/* Wavy Line */}
      <svg className="absolute top-0 rotate-180 left-0 w-full h-[50px] z-0" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 50">
        <path d="M0,40 C200,0 400,80 600,40 C800,0 1000,80 1200,40 L1200,50 L0,50 Z" fill="black" />
      </svg>
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#e5feb6] to-[#D1E5F4]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-[#253b74] mb-3"
          >
            خبراؤنا
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            فريق من الخبراء المتخصصين في مجالات متنوعة لتقديم أفضل الاستشارات والدعم
          </motion.p>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          centeredSlides
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 20
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30
            }
          }}
          className="consultants-swiper"
        >
          {consultants.map((consultant) => (
            <SwiperSlide key={consultant.id}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="flex items-center p-5 bg-gradient-to-r from-[#f5f9fd] to-white">
                  <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-full border-4 border-white shadow-md">
                    <Image
                      src={consultant.image || "/placeholder.svg"}
                      alt={consultant.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="ml-4 rtl:mr-4 rtl:ml-0 flex-1">
                    <h3 className="text-2xl font-bold text-[#91be3f]">{consultant.name}</h3>
                    <p className="text-[#253b74] font-medium text-sm">{consultant.role}</p>
                  </div>
                </div>
                <div className="px-5 py-4 bg-[#f5f9fd] bg-opacity-50">
                  <p className="text-gray-700 text-sm leading-relaxed">{consultant.description}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}