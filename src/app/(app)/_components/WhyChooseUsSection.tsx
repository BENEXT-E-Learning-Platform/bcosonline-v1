import React from 'react';
import { FaCertificate, FaCommentDots, FaUserFriends, FaVideo } from 'react-icons/fa';

const WhyChooseUsSection = () => {
  const features = [
    { title: "دورات تفاعلية", description: "إمكانية طرح أسئلة أسفل كل درس ليجيب عليها المكون", icon: <FaCommentDots className="text-white w-6 h-6" /> },
    { title: "متابعة مستمرة", description: "المشاركة في لقاء مباشر live مع المكون", icon: <FaVideo className="text-white w-6 h-6" /> },
    { title: "تبادل الخبرات", description: "الانضمام إلى مجموعة مغلقة على الفيسبوك لتبادل الخبرات مع المشاركين", icon: <FaUserFriends className="text-white w-6 h-6" /> },
    { title: "شهادة معتمدة", description: "الحصول على شهادة إتمام الدورة بعد إجتياز اختبار تقييمي", icon: <FaCertificate className="text-white w-6 h-6" /> },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#c9e4ff] to-[#ffffff] opacity-90"></div>
      <div className="absolute bottom-20% right-10 w-20 h-20 rounded-full bg-[#1b75bc] opacity-30 rotate-45 animate-float-slow"></div>
      <svg className="absolute inset-0 z-0" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15%" cy="25%" r="0.6vw" fill="#91be3f" opacity="0.5" />
        <circle cx="85%" cy="75%" r="0.4vw" fill="#1b75bc" opacity="0.5" />
      </svg>
      <div className="absolute inset-0 z-0 [background-size:30px_30px] [background-image:linear-gradient(to_right,#91be3f_1px,transparent_1px),linear-gradient(to_top,#91be3f_1px,transparent_1px)] opacity-5"></div>
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-[#253b74]" data-aos="fade-down">لماذا تختار منصتنا؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col justify-center items-center p-4 border bg-white border-gray-200 rounded-xl shadow-md hover:shadow-lg transition" data-aos="fade-up" data-aos-delay={index * 200}>
              <div className="w-12 h-12 bg-[#253b74] rounded-full flex items-center justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-[#253b74]">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;