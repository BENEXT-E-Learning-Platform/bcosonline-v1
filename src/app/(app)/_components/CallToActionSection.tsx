import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Modal, ModalTrigger } from '../header/_components/animated-modal';

const CallToActionSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // 3D transformation values
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-10, 10]);
  const translateZ = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-br from-[#253b74] to-[#1a2c5b] text-white overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-[#91be3f] rounded-full blur-3xl"
          style={{ transform: 'translate(25%, -25%)' }}
        />
        <div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
          style={{ transform: 'translate(-25%, 25%)' }}
        />
      </div>

      {/* Content container with perspective */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 max-w-4xl text-center relative z-10"
        style={{ perspective: 1000 }}
      >
        {/* 3D animated card */}
        <motion.div 
          style={{
            rotateX,
            rotateY,
            translateZ,
            scale,
            transformStyle: 'preserve-3d'
          }}
          className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20"
        >
          <h2 className="text-4xl font-extrabold mb-5 leading-tight tracking-tight text-white">
            ابدأ رحلة التعلم اليوم
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-200 leading-relaxed">
            انضم إلى آلاف الطلاب الذين يتعلمون بالفعل على منصتنا، وحوّل أهدافك التعليمية إلى واقع.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/signup" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#91be3f] text-white font-bold rounded-lg 
              hover:bg-opacity-90 transition-all duration-300 ease-in-out transform hover:scale-105 
              shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#91be3f] focus:ring-offset-2"
            >
              <ArrowRight className="w-5 h-5" />
              ابدأ مجانًا
            </Link>
            
            <Modal>
              <ModalTrigger 
                className="flex items-center justify-center gap-2 px-8 py-4 
                border-2 border-white/20 rounded-lg font-bold 
                hover:bg-white/10 transition-all duration-300 ease-in-out 
                transform hover:scale-105 backdrop-blur-sm 
                focus:outline-none focus:ring-2 focus:ring-white/50 
                dark:bg-white dark:text-black text-white group/modal-btn"
              >
                <Link 
                  href="/courses" 
                  className="group-hover/modal-btn:translate-x-40 text-center transition duration-500"
                >
                  تصفح الدورات
                </Link>
                <Link 
                  href="/courses" 
                  className="-translate-x-40 group-hover/modal-btn:translate-x-0 
                  flex items-center justify-center absolute inset-0 
                  transition duration-500 text-white z-20"
                >
                  <BookOpen className="w-5 h-5" />
                </Link>
              </ModalTrigger>
            </Modal>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CallToActionSection;