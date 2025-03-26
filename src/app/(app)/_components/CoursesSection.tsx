import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Card from './Card';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';

const CoursesSection = () => {
    // Enhanced course data with ratings and categories
    const courses = [
        {
            id: 1,
            title: "دليلك للاستراتيجية تسويقية رقمية",
            instructor: "أنيس حدادي",
            price: "د.ج 8,900.00",
            originalPrice: "د.ج 12,000.00",
            image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y291cnNlfGVufDB8fDB8fHww",
            stats: { cases: 2, files: 2, videos: 25, hours: 8 },
            gradient: "from-[#2a4383] to-[#4a62a8]",
            rating: 4.8,
            reviews: 124,
            category: "التسويق الرقمي",
            bestSeller: true
        },
        {
            id: 2,
            title: "تعلم تقنيات الإكسل EXCEL",
            instructor: "أحمد داني نوح",
            price: "د.ج 6,000.00",
            originalPrice: "د.ج 8,500.00",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvdXJzZXxlbnwwfHwwfHx8MA%3D%3D",
            stats: { cases: 1, files: 22, videos: 32, hours: 12 },
            gradient: "from-[#008242] to-[#00a854]",
            rating: 4.6,
            reviews: 89,
            category: "تطوير المهارات",
            new: true
        },
        {
            id: 3,
            title: "تسيير شؤون الموظفين",
            instructor: "أشرف قرين",
            price: "د.ج 12,000.00",
            image: "https://images.unsplash.com/photo-1508830524289-0adcbe822b40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGNvdXJzZXxlbnwwfHwwfHx8MA%3D%3D",
            stats: { cases: 4, files: 1, videos: 17, hours: 6 },
            gradient: "from-[#0a2d5c] to-[#1a4c92]",
            rating: 4.9,
            reviews: 215,
            category: "إدارة الأعمال",
            bestSeller: true
        },
        {
            id: 4,
            title: "تطوير المواقع الإلكترونية",
            instructor: "محمد راشد",
            price: "د.ج 9,800.00",
            originalPrice: "د.ج 14,000.00",
            image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGNvdXJzZXxlbnwwfHwwfHx8MA%3D%3D",
            stats: { cases: 4, files: 1, videos: 17, hours: 10 },
            gradient: "from-[#0a2d5c] to-[#1a4c92]",
            rating: 4.7,
            reviews: 156,
            category: "تطوير الويب"
        },
        {
            id: 5,
            title: "أساسيات الذكاء الاصطناعي",
            instructor: "ليلى أحمد",
            price: "د.ج 11,500.00",
            image: "https://images.unsplash.com/photo-1518186233392-c232efbf2373?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fGNvdXJzZXxlbnwwfHwwfHx8MA%3D%3D",
            stats: { cases: 4, files: 1, videos: 17, hours: 9 },
            gradient: "from-[#0a2d5c] to-[#1a4c92]",
            rating: 4.5,
            reviews: 72,
            category: "التكنولوجيا",
            new: true
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const autoScrollRef = useRef(null);
    const [direction, setDirection] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const carouselRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Function to determine visible courses based on screen width
    const getVisibleCount = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1280) return 3;
            if (window.innerWidth >= 768) return 2;
            return 1;
        }
        return 3;
    };

    const [visibleCount, setVisibleCount] = useState(getVisibleCount());

    // Update visible count on resize with debounce
    useEffect(() => {
        let timeoutId = null;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setVisibleCount(getVisibleCount());
            }, 100);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Circular array helper
    const normalizeIndex = (index) => {
        return ((index % courses.length) + courses.length) % courses.length;
    };

    // Get visible courses for current view
    const getVisibleCourses = () => {
        const result = [];
        for (let i = 0; i < visibleCount; i++) {
            const index = normalizeIndex(activeIndex + i);
            result.push({ ...courses[index], position: i });
        }
        return result;
    };

    // Auto-scroll with pause on hover
    useEffect(() => {
        startAutoScroll();
        return () => clearInterval(autoScrollRef.current);
    }, [activeIndex, isAnimating, isHovered]);

    const startAutoScroll = () => {
        clearInterval(autoScrollRef.current);
        if (!isAnimating && !isHovered) {
            autoScrollRef.current = setInterval(() => {
                handleNext();
            }, 2000);
        }
    };

    // Touch handlers with better swipe detection
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);

        const diff = Math.abs(touchStart - e.targetTouches[0].clientX);
        if (diff > 10) {
            e.preventDefault();
        }
    };

    const handleTouchEnd = () => {
        const threshold = 50;
        if (touchStart - touchEnd > threshold) handleNext();
        if (touchStart - touchEnd < -threshold) handlePrev();
    };

    // Navigation handlers with improved animation control
    const navigateTo = (newIndex) => {
        if (isAnimating || newIndex === activeIndex) return;

        setIsAnimating(true);
        const calculatedDirection = newIndex > activeIndex ? 1 : -1;
        if (Math.abs(newIndex - activeIndex) > courses.length / 2) {
            setDirection(newIndex > activeIndex ? -1 : 1);
        } else {
            setDirection(calculatedDirection);
        }
        setActiveIndex(normalizeIndex(newIndex));
        clearInterval(autoScrollRef.current);

        setTimeout(() => {
            setIsAnimating(false);
            startAutoScroll();
        }, 2000);
    };

    const handlePrev = () => navigateTo(activeIndex + 1);
    const handleNext = () => navigateTo(activeIndex - 1);
    const handleDotClick = (index) => navigateTo(index);

    // Card animation variants
    const cardVariants = {
        enterRight: { x: '-100%', opacity: 0 },
        enterLeft: { x: '100%', opacity: 0 },
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
        },
        exitRight: {
            x: '-100%',
            opacity: 0,
            transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
        },
        exitLeft: {
            x: '100%',
            opacity: 0,
            transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] }
        }
    };

    // Rating stars component
    const RatingStars = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                    <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                {hasHalfStar && (
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <defs>
                            <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                                <stop offset="50%" stopColor="currentColor" />
                                <stop offset="50%" stopColor="#D1D5DB" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                    <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white dir-rtl">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-[#253b74] mb-3">اكتشف دوراتنا التعليمية</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        انضم إلى آلاف المتعلمين الذين طوروا مهاراتهم مع أفضل المدربين في الوطن العربي
                    </p>
                </div>

                <div
                    ref={carouselRef}
                    className="relative overflow-hidden px-4 md:px-12"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ touchAction: 'pan-y' }}
                >
                    {/* Navigation arrows */}
                    <button
                        onClick={handlePrev}
                        disabled={isAnimating}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-full shadow-lg text-[#253b74] hover:bg-gray-100 transition-all duration-300 hover:scale-110 focus:outline-none disabled:opacity-50 group"
                        aria-label="Previous slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Courses carousel */}
                    <div className="relative overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                                {getVisibleCourses().map((course) => (
                                    <motion.div
                                        key={`course-${course.id}-pos-${course.position}`}
                                        custom={direction}
                                        variants={cardVariants}
                                        initial={direction > 0 ? "enterRight" : "enterLeft"}
                                        animate="center"
                                        exit={direction > 0 ? "exitLeft" : "exitRight"}
                                        whileHover={{ y: -8 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                        className="h-full rounded-xl"
                                        style={{
                                            willChange: 'transform, opacity',
                                            gridColumn: `span 1`,
                                        }}
                                    >
                                        <Card className="h-full rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
                                            {/* Course badge */}
                                            {(course.bestSeller || course.new) && (
                                                <div className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold rounded-full text-white ${course.bestSeller ? 'bg-[#f59e0b]' : 'bg-[#10b981]'
                                                    }`}>
                                                    {course.bestSeller ? 'الأكثر مبيعاً' : 'جديد'}
                                                </div>
                                            )}

                                            {/* Course image as full cover */}
                                            <div className="relative h-48 w-full overflow-hidden">
                                                <Image
                                                    src={course.image}
                                                    alt={course.title}
                                                    fill
                                                    className="object-cover"
                                                    loading="eager"
                                                    priority={course.position === 0}
                                                />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-500"></div>
                                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                                    <span className="text-sm text-white opacity-90 mb-1 block">{course.category}</span>
                                                    <h3 className="text-lg font-bold text-white line-clamp-2">{course.title}</h3>
                                                </div>
                                            </div>

                                            {/* Course details */}
                                            <div className="p-5 flex flex-col">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                                        <RatingStars rating={course.rating} />
                                                        <span className="text-sm text-gray-600 mr-1">({course.reviews})</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {course.stats.hours} ساعة
                                                    </div>
                                                </div>

                                                <h3 className="text-[#253b74] font-bold text-lg mt-2 mb-4 line-clamp-2 h-14">{course.title}</h3>

                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex space-x-3 rtl:space-x-reverse text-gray-600 text-sm">
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            <span className="font-bold text-[#253b74]">{course.stats.videos}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span className="font-bold text-[#253b74]">{course.stats.files}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                            <span className="font-bold text-[#253b74]">{course.stats.cases}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mb-3">
                                                    <div>
                                                        <div className="font-bold text-xl text-[#253b74]">{course.price}</div>
                                                        {course.originalPrice && (
                                                            <div className="text-sm text-gray-400 line-through">{course.originalPrice}</div>
                                                        )}
                                                    </div>
                                                    {course.originalPrice && (
                                                        <div className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                                                            خصم {Math.round(1 - parseFloat(course.price.replace(/[^0-9.]/g, '')) / parseFloat(course.originalPrice.replace(/[^0-9.]/g, '')) * 100)}%
                                                        </div>
                                                    )}
                                                </div>

                                                <Button
                                                    className="mt-auto w-full bg-gradient-to-l from-[#253b74] to-[#3a5a9c] text-white hover:from-[#1c2c5a] hover:to-[#2a4383] transition-all duration-300 py-3 text-base font-bold hover:shadow-lg"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    سجل الآن في الدورة
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        disabled={isAnimating}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white rounded-full shadow-lg text-[#253b74] hover:bg-gray-100 transition-all duration-300 hover:scale-110 focus:outline-none disabled:opacity-50 group"
                        aria-label="Next slide"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* Dots navigation */}
                <div className="flex justify-center mt-8 space-x-3 rtl:space-x-reverse">
                    {courses.map((_, index) => (
                        <button
                            key={index}
                            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${index === activeIndex
                                ? 'bg-[#253b74] w-6 md:w-8 scale-125'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            onClick={() => handleDotClick(index)}
                            disabled={isAnimating}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* View all courses button */}
                <div className="text-center mt-12">
                    <Link
                        href="/courses"
                        className="px-8 py-3 rounded-3xl bg-gradient-to-l from-[#253b74] to-[#3a5a9c] text-white font-bold hover:from-[#1c2c5a] hover:to-[#2a4383] transition-all duration-300 hover:shadow-lg inline-flex items-center"
                    >
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        عرض جميع الدورات
                        
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CoursesSection;