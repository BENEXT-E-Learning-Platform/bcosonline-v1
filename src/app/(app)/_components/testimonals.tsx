/* eslint-disable react/react-in-jsx-scope */
"use client";


import { cn } from "@/utilities/utils";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { Marquee } from "./marquee";


export function Highlight({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={cn(
                "bg-[#dbff9c] p-1 py-0.5 font-bold text-[#91BF40] dark:bg-[#dbff9c] dark:text-[#91BF40]",
                className,
            )}
        >
            {children}
        </span>
    );
}

export interface TestimonialCardProps {
    name: string;
    role: string;
    img?: string;
    description: React.ReactNode;
    className?: string;
    [key: string]: any;
}

export function TestimonialCard({
    description,
    name,
    img,
    role,
    className,
    ...props // Capture the rest of the props
}: TestimonialCardProps) {
    return (
        <div
            className={cn(
                "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
                // light styles
                " border border-neutral-200 bg-white",
                // dark styles
                "dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
                className,
            )}
            {...props}
        >
            <div className="select-none text-sm font-normal text-neutral-700 dark:text-neutral-400">
                {description}
                <div className="flex flex-row py-1">
                    <Star className="size-4 fill-yellow-500 text-yellow-500" />
                    <Star className="size-4 fill-yellow-500 text-yellow-500" />
                    <Star className="size-4 fill-yellow-500 text-yellow-500" />
                    <Star className="size-4 fill-yellow-500 text-yellow-500" />
                    <Star className="size-4 fill-yellow-500 text-yellow-500" />
                </div>
            </div>

            <div className="flex w-full select-none items-center justify-start gap-5">
                <Image
                    width={40}
                    height={40}
                    src={img || ""}
                    alt={name}
                    className="size-10 rounded-full ring-1 ring-border ring-offset-4"
                />

                <div>
                    <p className="font-medium text-neutral-500">{name}</p>
                    <p className="text-xs font-normal text-neutral-400">{role}</p>
                </div>
            </div>
        </div>
    );
}
const testimonials = [
    {
        name: "Alex Rivera",
        role: "UI/UX Lead at InnovateTech",
        img: "https://randomuser.me/api/portraits/men/91.jpg",
        description: (
            <p>
                لقد أحدث استخدام EldoraUI ثورة في عملية التصميم لدينا.
                <Highlight>
                    مكوناتها القابلة لإعادة الاستخدام والمتحركة تجعل من السهل تقديم تصاميم رائدة.
                </Highlight>
                ضروري لأي فريق تصميم.
            </p>
        ),
    },
    {
        name: "Samantha Lee",
        role: "Frontend Engineer at NextGen Solutions",
        img: "https://randomuser.me/api/portraits/women/12.jpg",
        description: (
            <p>
                لقد حسّنت قوالب EldoraUI سرعة التطوير لدينا بشكل كبير.
                <Highlight>
                    لقد قلصنا جداول المشاريع بنسبة 70%، مع تقديم واجهات مستخدم عالية الجودة بسهولة.
                </Highlight>
                نوصي به بشدة لزملائنا المطورين.
            </p>
        ),
    },
    {
        name: "Raj Patel",
        role: "Founder at Startup Studio",
        img: "https://randomuser.me/api/portraits/men/45.jpg",
        description: (
            <p>
                كمؤسس لشركة ناشئة، أحتاج إلى أدوات تساعدنا على النمو بسرعة دون التضحية بالجودة. لقد جعلت تصاميم EldoraUI المذهلة وتكاملها البسيط منها جزءاً أساسياً من سير عملنا.
                <Highlight>
                    يحب عملاؤنا واجهاتنا الحديثة.
                </Highlight>
            </p>
        ),
    },
    {
        name: "Emily Chen",
        role: "Product Designer at Global Systems",
        img: "https://randomuser.me/api/portraits/women/83.jpg",
        description: (
            <p>
                لقد جعلت مكونات EldoraUI المبنية مسبقاً من السهل جداً إنشاء تصاميم بديهية ومتوافقة.
                <Highlight>
                    إنها مثالية للتعامل مع سير العمل المعقدة بأسلوب أنيق.
                </Highlight>
                ضروري لأي مصمم منتجات.
            </p>
        ),
    },
    {
        name: "Michael Brown",
        role: "Creative Director at FinTech Innovations",
        img: "https://randomuser.me/api/portraits/men/1.jpg",
        description: (
            <p>
                لقد رفعت حركيات EldoraUI وعناصر التصميم من تجربة المستخدم في تطبيقنا المالي.
                <Highlight>
                    الملاحظات على تصميمنا الجديد رائعة.
                </Highlight>
                إنها تغيير قواعد اللعبة للتطبيقات التي تركز على المستخدم.
            </p>
        ),
    },
    {
        name: "Linda Wu",
        role: "Web Developer at LogiChain Solutions",
        img: "https://randomuser.me/api/portraits/women/5.jpg",
        description: (
            <p>
                لقد بسطت مكتبة مكونات EldoraUI تطوير الويب للوحة التحكم اللوجستية لدينا.
                <Highlight>
                    لم يكن بناء التخطيطات المخصصة بهذه الكفاءة من قبل.
                </Highlight>
            </p>
        ),
    },
    {
        name: "Carlos Gomez",
        role: "Digital Marketing Specialist at EcoTech",
        img: "https://randomuser.me/api/portraits/men/14.jpg",
        description: (
            <p>
                لقد ساعدتنا تصاميم EldoraUI المتجاوبة في إنشاء مواقع تسويقية تبدو رائعة على كل جهاز.
                <Highlight>
                    لقد أحدثت ثورة في طريقة تعاملنا مع العلامة التجارية عبر الإنترنت.
                </Highlight>
            </p>
        ),
    },
    {
        name: "Aisha Khan",
        role: "E-commerce Product Manager at FashionForward",
        img: "https://randomuser.me/api/portraits/women/56.jpg",
        description: (
            <p>
                لقد حولت مكونات EldoraUI المصممة بشكل جميل واجهة متجر الأزياء لدينا بالكامل.
                <Highlight>
                    يحب العملاء تجربة التسوق الديناميكية.
                </Highlight>
            </p>
        ),
    },
    {
        name: "Tom Chen",
        role: "Healthcare App Designer at HealthTech Solutions",
        img: "https://randomuser.me/api/portraits/men/18.jpg",
        description: (
            <p>
                لقد جعلت EldoraUI من السهل إنشاء واجهات سهلة الاستخدام ومتاحة لتطبيقات الرعاية الصحية لدينا.
                <Highlight>
                    إنها جزء حاسم من نظام التصميم لدينا.
                </Highlight>
            </p>
        ),
    },
    {
        name: "Sofia Patel",
        role: "EdTech Founder at EduSafe Innovations",
        img: "https://randomuser.me/api/portraits/women/73.jpg",
        description: (
            <p>
                لقد ضاعفت قوالب EldoraUI الموجهة للتعليم من قابلية استخدام منصتنا.
                <Highlight>
                    إنها مصممة خصيصاً لتلبية احتياجات الطلاب والمعلمين.
                </Highlight>
            </p>
        ),
    },
];

export function Testimonials() {
    return (
        <section id="testimonials" className="container py-10">
            <h2 className="text-4xl font-bold text-[#253b74] mb-3 text-center leading-[1.2] tracking-tighter">
                قالوا عنا
            </h2>

            <div className="relative mt-6 max-h-screen overflow-hidden">
                <div className="gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
                    {Array(Math.ceil(testimonials.length / 3))
                        .fill(0)
                        .map((_, i) => (
                            <Marquee
                                vertical
                                key={i}
                                className={cn({
                                    "[--duration:60s]": i === 1,
                                    "[--duration:30s]": i === 2,
                                    "[--duration:70s]": i === 3,
                                })}
                            >
                                {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: Math.random() * 0.8,
                                            duration: 1.2,
                                        }}
                                    >
                                        <TestimonialCard {...card} />
                                    </motion.div>
                                ))}
                            </Marquee>
                        ))}
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-background from-20%"></div>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-background from-20%"></div>
            </div>
        </section>
    );
}
