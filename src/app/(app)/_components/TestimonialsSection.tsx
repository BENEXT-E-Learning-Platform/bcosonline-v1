/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/display-name */
import { useState, useEffect, useCallback, memo } from "react";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
    {
      id: 1,
      name: "سارة جونسون",
      role: "مصمم منتجات",
      comment: "لقد غيرت هذه المنصة تمامًا كيفية تعاملنا مع أنظمة التصميم. الكفاءة وميزات التعاون لا مثيل لها!",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a"
    },
    {
      id: 2,
      name: "مايكل تشين",
      role: "مطور أول",
      comment: "قدرات التكامل وتجربة المطور استثنائية. لقد جعلت سير عملنا سلسًا وأكثر إنتاجية.",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
    },
    {
      id: 3,
      name: "إيما ويلسون",
      role: "مصمم واجهة المستخدم/تجربة المستخدم",
      comment: "أنا معجب بالاهتمام بالتفاصيل والنهج المتمحور حول المستخدم. إنه يغير قواعد اللعبة لفريق التصميم لدينا.",
      avatar: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1"
    }
];

const TestimonialCard = memo(({ data, index, activeIndex }) => {
  const getCardStyle = () => {
    const offset = (index - activeIndex) * 20;
    const scale = 1 - Math.abs(index - activeIndex) * 0.1;
    const opacity = 1 - Math.abs(index - activeIndex) * 0.3;

    return {
      transform: `translateY(${offset}px) scale(${scale})`,
      opacity: opacity,
      zIndex: testimonials.length - Math.abs(index - activeIndex)
    };
  };

  return (
    <div
      className="absolute w-full transition-all duration-500 ease-in-out"
      style={getCardStyle()}
      role="article"
      aria-hidden={index !== activeIndex}
    >
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="relative">
          <div className="absolute -top-2 left-4 text-gray-200">
            <FaQuoteLeft size={24} />
          </div>
          <div className="flex flex-col items-center">
            <img
              src={data.avatar}
              alt={data.name}
              className="w-20 h-20 rounded-full object-cover mb-4"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330";
              }}
              loading="lazy"
            />
            <h3 className="text-xl font-semibold text-gray-800">{data.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{data.role}</p>
            <p className="text-gray-700 italic text-center line-clamp-3">
              {data.comment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

const TestimonialCardStack = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextTestimonial = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setActiveIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  }, []);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextTestimonial, 4000);
      return () => clearInterval(interval);
    }
  }, [isPaused, nextTestimonial]);

  return (
    <div
      className="relative min-h-[400px] max-w-2xl mx-auto px-4 py-12 w-full"
    >
      <div className="relative h-[300px]">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            data={testimonial}
            index={index}
            activeIndex={activeIndex}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={prevTestimonial}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="Previous testimonial"
        >
          <FaChevronRight className="text-gray-600" />
        </button>
        <div className="flex gap-2 items-center">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={nextTestimonial}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="Next testimonial"
        >
          <FaChevronLeft className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCardStack;