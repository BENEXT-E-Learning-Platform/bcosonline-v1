import React from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail 
} from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Linkedin, href: '#' },
  ];

  const footerSections = [
    {
      title: 'تعلم',
      links: [
        { label: 'جميع الدورات', href: '/courses' },
        { label: 'التسعير', href: '/pricing' },
        { label: 'المدونة', href: '/blog' },
      ]
    },
    {
      title: 'الشركة',
      links: [
        { label: 'معلومات عنا', href: '/about' },
        { label: 'فرص العمل', href: '/careers' },
        { label: 'اتصل بنا', href: '/contact' },
      ]
    },
    {
      title: 'الدعم',
      links: [
        { label: 'مركز المساعدة', href: '/help' },
        { label: 'الأسئلة الشائعة', href: '/faq' },
        { label: 'دليل المستخدم', href: '/guide' },
      ]
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-3xl font-bold mb-4 text-[#91be3f]">منصة التعلم</h2>
            <p className="text-gray-300 mb-6">
              نحن نؤمن بالتعلم المستمر وتمكين الأفراد من تطوير مهاراتهم وتحقيق أهدافهم.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 rtl:space-x-reverse">
              {socialLinks.map(({ icon: Icon, href }, index) => (
                <Link 
                  key={index} 
                  href={href} 
                  className="text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
                >
                  <Icon className="w-6 h-6" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-bold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-[#91be3f] transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Signup */}
          <div className="col-span-1 md:col-span-4 border-t border-gray-700 pt-8 mt-8 text-center">
            <div className="max-w-md mx-auto">
              <h4 className="text-xl font-bold mb-4">اشترك في النشرة البريدية</h4>
              <div className="flex items-center bg-white/10 rounded-lg overflow-hidden">
                <input 
                  type="email" 
                  placeholder="أدخل بريدك الإلكتروني" 
                  className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                />
                <button className="bg-[#91be3f] px-6 py-3 hover:bg-opacity-90 transition-colors">
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-gray-700">
          <p className="text-gray-400">© ٢٠٢٥ جميع الحقوق محفوظة لمنصة التعلم.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;