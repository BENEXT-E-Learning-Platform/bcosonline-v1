'use client'
import React, { useEffect } from 'react';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ClientHeader from './header/ClientHeader';
import { Modal, ModalTrigger } from './header/_components/animated-modal';
import { AnimatedImageCarousel } from './header/_components/animated-testimonials';
import { cn } from '@/utilities/utils';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import CallToActionSection from './_components/CallToActionSection';
import CoursesSection from './_components/CoursesSection';
import Footer from './_components/Footer';
import WhyChooseUsSection from './_components/WhyChooseUsSection';
import TestimonialCardStack from './_components/TestimonialsSection';
import ConsultantsSection from './_components/ConsultantsCarousel';
import { Testimonials } from './_components/testimonals';

const HeroSection = () => {
  const heroImages = [
    { src: "https://images.unsplash.com/photo-1559223607-a43c990c692c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Image 1" },
    { src: "https://img.freepik.com/free-photo/analysis-market_1098-14109.jpg?t=st=1742663635~exp=1742667235~hmac=b2927ace5fbb41ce48a185c108c95ce4341c68b43a2e6587e18ec390b0f2b001&w=1380", alt: "Image 2" },
    { src: "https://img.freepik.com/free-photo/report-audience_1098-14137.jpg?t=st=1742663673~exp=1742667273~hmac=8b651b50b4896f4e7148ff409e125748ef065e407d7641f90830f47543c76b19&w=1380", alt: "Image 3" },
  ];
  return (
    <section className="relative pt-12 pb-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4 max-w-5xl relative z-10 text-white">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h1 className="text-5xl md:text-5xl font-bold mb-4" data-aos="fade-up">
              طور مشروعك بالتعلم أونلاين
            </h1>
            <p className="text-xl mb-6" data-aos="fade-up" data-aos-delay="200">
              نرافقك في رحلة تطوير مشروعك : التسويق، التسيير المالي، تسيير الموارد البشرية …, من عالم واحد
            </p>
            <div className="flex flex-wrap gap-4" data-aos="fade-up" data-aos-delay="400">
              <Modal>
                <ModalTrigger className="px-6 py-3 rounded-full bg-[#91be3f] font-bold dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
                  <Link href="/courses" className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                    اكتشف دوراتنا
                  </Link>
                  <Link href="/courses" className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                    📚
                  </Link>
                </ModalTrigger>
              </Modal>
              <Link href="/signup" className="px-6 py-3 border-2 border-white rounded-full font-bold hover:bg-white hover:text-[#253b74] transition">
                التسجيل مجانًا
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <AnimatedImageCarousel images={heroImages} interval={8000} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MetricsSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <section className="py-20 relative overflow-hidden" ref={ref}>
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#E6F0FA] to-[#D1E5F4]"></div>

      {/* Circular Shape (Top Right) */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[200px] max-h-[200px] rounded-full bg-gradient-to-br from-[#1B75BC] to-[#A3CFFA] opacity-30 transform translate-x-1/3 -translate-y-1/3"></div>

      {/* Curved Shape (Bottom Left) */}
      <div className="absolute bottom-0 left-0 w-full h-[15vh] max-h-[100px] bg-gradient-to-b from-[#E6F0FA] to-[#D1E5F4] opacity-30" style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%, 0 100%)' }}></div>

      {/* Scattered Dots */}
      <svg className="absolute inset-0 z-0" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80%" cy="70%" r="0.5vw" fill="#91be3f" />
        <circle cx="85%" cy="75%" r="0.4vw" fill="#91be3f" />
        <circle cx="90%" cy="65%" r="0.6vw" fill="#91be3f" />
        <circle cx="95%" cy="70%" r="0.3vw" fill="#91be3f" />
        <circle cx="90%" cy="10%" r="0.5vw" fill="#1b75bc" />
        <circle cx="95%" cy="5%" r="0.4vw" fill="#1b75bc" />
      </svg>

      {/* Wavy Line */}
      <svg className="absolute bottom-0 left-0 w-full h-[50px] z-0" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 50">
        <path d="M0,40 C200,0 400,80 600,40 C800,0 1000,80 1200,40 L1200,50 L0,50 Z" fill="#ffffff" />
      </svg>

      {/* Existing Content */}
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div
            className="bg-gradient-to-br from-[#0533AC] to-[#253B75] rounded-xl drop-shadow-xl shadow-[#0533AC] p-8 text-center flex items-center justify-center"
            data-aos="fade-up"
            data-aos-delay="0"
          >
            <p className="text-white text-4xl">أهم الأرقام المحققة</p>
          </div>
          <div
            className="bg-white rounded-xl shadow-xl shadow-[#c8c8c8] p-6 text-center"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="w-12 h-12 bg-[#253B74] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V15C22 16.6569 20.6569 18 19 18H13V19H15C15.5523 19 16 19.4477 16 20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19H11V18H5C3.34315 18 2 16.6569 2 15V6ZM5 5C4.44772 5 4 5.44772 4 6V15C4 15.5523 4.44772 16 5 16H19C19.5523 16 20 15.5523 20 15V6C20 5.44772 19.5523 5 19 5H5Z" fill="#ffffff" />
              </svg>
            </div>
            <h3 className="text-3xl text-[#253b74]">
              {inView ? <CountUp end={16} duration={2} /> : '0'}
            </h3>
            <p className="text-gray-500 text-2xl">دورة تكوينية</p>
          </div>
          <div
            className="bg-white rounded-xl shadow-xl shadow-[#c8c8c8] p-6 text-center"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="w-12 h-12 bg-[#1B75BC] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg height="30" width="30" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#ffffff">
                <path d="M116.738,231.551c0,23.245,14.15,43.315,34.513,49.107c15.262,42.368,55.574,70.776,100.582,70.776 s85.32-28.408,100.58-70.776c20.365-5.792,34.515-25.854,34.515-49.107c0-15.691-6.734-30.652-18.061-40.248l1.661-8.921 c0-3.323-0.229-6.568-0.491-9.821l-0.212-2.593l-2.213,1.374c-30.871,19.146-80.885,27.71-116.754,27.71 c-34.85,0-83.895-8.214-114.902-26.568l-2.259-0.59l-0.188,2.554c-0.192,2.632-0.384,5.256-0.357,8.23l1.632,8.649 C123.466,200.923,116.738,215.876,116.738,231.551z" />
                <path d="M356.151,381.077c-9.635-5.97-18.734-11.607-26.102-17.43l-0.937-0.738l-0.972,0.691 c-6.887,4.914-31.204,30.17-51.023,51.172l-10.945-21.273l5.697-4.076v-20.854h-40.07v20.854l5.697,4.076l-10.949,21.281 c-19.825-21.009-44.154-46.265-51.034-51.18l-0.973-0.691l-0.937,0.738c-7.368,5.823-16.469,11.46-26.102,17.43 c-30.029,18.61-64.062,39.697-64.062,77.344c0,22.244,52.241,53.579,168.388,53.579c116.146,0,168.388-31.335,168.388-53.579 C420.213,420.774,386.178,399.687,356.151,381.077z" />
                <path d="M131.67,131.824c0,18.649,56.118,42.306,119.188,42.306s119.188-23.656,119.188-42.306v-25.706l43.503-17.702 v55.962c-5.068,0.792-8.964,5.186-8.964,10.45c0,4.503,2.966,8.432,7.242,9.852l-8.653,57.111h40.704l-8.651-57.111 c4.27-1.421,7.232-5.35,7.232-9.852c0-5.295-3.919-9.697-9.014-10.466l-0.21-67.197c0.357-0.621,0.357-1.266,0.357-1.607 c0-0.342,0-0.978-0.149-0.978h-0.002c-0.262-2.446-2.011-4.612-4.56-5.652l-11.526-4.72L267.551,3.238 C262.361,1.118,256.59,0,250.858,0s-11.502,1.118-16.69,3.238L72.834,68.936c-2.863,1.172-4.713,3.773-4.713,6.622 c0,2.842,1.848,5.443,4.716,6.63l58.833,23.928V131.824z" />
              </svg>
            </div>
            <h3 className="text-3xl text-[#1B75BC]">
              {inView ? <CountUp end={5114} duration={2} /> : '0'}
            </h3>
            <p className="text-gray-500 text-2xl">مشترك</p>
          </div>
          <div
            className="bg-white rounded-xl shadow-xl shadow-[#c8c8c8] p-6 text-center"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="w-12 h-12 bg-[#91BF40] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" height="30" width="30">
                <g>
                  <path d="M43.84,78.55l9.74,28.64l4.9-17l-2.4-2.63c-1.08-1.58-1.32-2.96-0.72-4.15c1.3-2.57,3.99-2.09,6.5-2.09 c2.63,0,5.89-0.5,6.71,2.8c0.28,1.1-0.07,2.26-0.84,3.44l-2.4,2.63l4.9,17l8.82-28.64c6.36,5.72,25.19,6.87,32.2,10.78 c2.22,1.24,4.22,2.81,5.83,4.93c2.44,3.23,3.94,7.44,4.35,12.79l1.46,9.33c-0.36,3.78-2.5,5.96-6.73,6.29H61.9H6.73 c-4.23-0.32-6.37-2.5-6.73-6.29l1.46-9.33c0.41-5.35,1.91-9.56,4.35-12.79c1.61-2.13,3.61-3.7,5.83-4.93 C18.65,85.42,37.48,84.27,43.84,78.55L43.84,78.55z M39.43,37.56c-1.21,0.05-2.12,0.3-2.74,0.72c-0.36,0.24-0.62,0.55-0.79,0.91 c-0.19,0.4-0.27,0.89-0.26,1.46c0.05,1.66,0.92,3.82,2.59,6.31l0.02,0.04l0,0l5.44,8.66c2.18,3.47,4.47,7.01,7.31,9.61 c2.73,2.5,6.05,4.19,10.44,4.2c4.75,0.01,8.23-1.75,11.04-4.39c2.93-2.75,5.25-6.51,7.53-10.27l6.13-10.1 c1.14-2.61,1.56-4.35,1.3-5.38c-0.16-0.61-0.83-0.91-1.97-0.96c-0.24-0.01-0.49-0.01-0.75-0.01c-0.27,0.01-0.56,0.03-0.86,0.05 c-0.16,0.01-0.32,0-0.47-0.03c-0.55,0.03-1.11-0.01-1.68-0.09l2.1-9.29c-11.21-0.14-18.88-2.09-27.95-7.89 c-2.98-1.9-3.88-4.08-6.86-3.87c-2.25,0.43-4.14,1.44-5.65,3.06c-1.44,1.55-2.53,3.67-3.24,6.38l1.19,10.95 C40.64,37.67,40.01,37.65,39.43,37.56L39.43,37.56z M87.57,35.61c1.51,0.46,2.48,1.42,2.87,2.97c0.44,1.72-0.04,4.13-1.49,7.43l0,0 c-0.03,0.06-0.06,0.12-0.09,0.18l-6.2,10.22c-2.39,3.94-4.82,7.88-8.06,10.92c-3.35,3.14-7.49,5.23-13.14,5.22 c-5.28-0.01-9.25-2.03-12.51-5.01c-3.15-2.88-5.56-6.6-7.85-10.24l-5.44-8.65c-1.99-2.97-3.02-5.68-3.09-7.91 c-0.03-1.05,0.15-2,0.53-2.83c0.41-0.88,1.03-1.61,1.87-2.17c0.39-0.26,0.83-0.49,1.32-0.67c-0.35-4.69-0.49-10.61-0.26-15.56 c0.12-1.17,0.34-2.35,0.67-3.53c1.39-4.97,4.88-8.97,9.2-11.72c1.52-0.97,3.19-1.77,4.95-2.41C61.3-1.95,75.16,0.12,82.58,8.14 c3.02,3.27,4.92,7.61,5.33,13.34L87.57,35.61L87.57,35.61z" fill="#ffffff" />
                </g>
              </svg>
            </div>
            <h3 className="text-3xl text-[#91BF40]">
              {inView ? <CountUp end={17} duration={2} /> : '0'}
            </h3>
            <p className="text-gray-500 text-2xl">مكون</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Page() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const script = document.createElement('script');
    script.src = './js/carousel.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <div className="flex flex-col" dir="rtl">
      <div className="relative items-center justify-center flex ">
        <div className="absolute inset-0 bg-gradient-to-br from-[#253b74] to-[#1b75bc] text-white">
          <div className={cn("absolute inset-0 z-0 [background-size:20px_20px] [background-image:radial-gradient(#b2d0e8_1px,#1b75bc_1px)] dark:[background-image:radial-gradient(#253b74_1px,transparent_1px)]")} />
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-[#1b75bc] [mask-image:radial-gradient(circle_at_left,transparent_30%,black)] dark:bg-black"></div>
        </div>
        <ClientHeader user={null} />
        <HeroSection />
      </div>
      <MetricsSection />
      <WhyChooseUsSection />
      <CoursesSection />
      <ConsultantsSection />
      <div className="relative z-10 h-[600px] w-full overflow-hidden rounded-lg border bg-background">
        <Testimonials />
      </div>
      <CallToActionSection />
      <Footer />
    </div>
  );
}