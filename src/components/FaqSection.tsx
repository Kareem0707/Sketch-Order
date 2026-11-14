import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { HandDrawnDivider } from './common/HandDrawnDivider';
import { playPencilScratch } from '../utils/soundEffects';

interface FaqItem {
 question: string;
 answer: string;
 doodleTip: string;
}

const FAQS: FaqItem[] = [
 {
 question: 'إيه فكرة "موقع جوا موقع"؟ وإزاي بمتلكه بشكل مستقل تماماً؟',
 answer: 'استوديو سكتش أوردر بيتيح لك تبني وتعديل شكل متجرك، وتختار الألوان والثيم والأقسام وتجرب الشراء جوه موقعنا كنسخة حية تفاعلية. أول ما تشتري المتجر، بنربط المخطط ده فوراً بدومين مستقل خاص بيك (.com أو .store) وبيكون ملكك أنت بالكامل بنسبة 100% بدون أي علاقة بموقعنا بعد التسليم!',
 doodleTip: ' بتجرب عربيتك قبل ما تشتريها، وبنفس الطريقة بتجرب متجرك وتملكه فوراً!',
 },
 {
 question: 'إيه طرق الدفع المتاحة لتملك المتجر في مصر؟',
 answer: 'نوفر لك أسهل وسائل الدفع في مصر: تحويل فوري عبر إنستاباي (InstaPay)، محفظة فودافون كاش، اتصالات كاش، أورنج كاش، بطاقات فيزا وماستركارد وبطاقات ميزة الوطنية، بالإضافة لأكواد فوري المتاحة في أي كشك وسوبرماركت.',
 doodleTip: ' كل الطرق اللي في جيبك شغالة وبدون أي تعقيد.',
 },
 {
 question: 'هل فيه أي اشتراكات شهرية أو نسب بتقتطعوها من مبيعاتي؟',
 answer: 'لا نهائياً! سكتش أوردر مبني على مبدأ التملك الدائم (One-time Payment). أنت بتدفع تكلفة تصميم وتجهيز متجرك مرة واحدة فقط، وكل جنيه بيجيلك من مبيعاتك وأرباحك بيدخل في جيبك ومحفظتك مباشرة 100%.',
 doodleTip: ' مكسبك كله ليك بدون ما حد يقاسمك في أرباحك.',
 },
 {
 question: 'هل المتجر بيشتغل بسرعة على باقات الموبايل والـ 4G في مصر؟',
 answer: 'بسرعة البرق! واجهات سكتش مبنية بكود حبري فائق الخفة والسرعة (Clean SVG Engine)، بتفتح في أجزاء من الثانية حتى مع أضعف سرعات النت بدون أي تهنيج أو ثقل.',
 doodleTip: ' الزبون هيفتح الرابط يطلب في ثواني وهو راكب المترو أو الميكروباص!',
 },
 {
 question: 'لو حبيت أغير أسعار الكوتشيات أو أضيف منتجات جديدة، أقدر أعملها بنفسي؟',
 answer: 'بكل سهولة! بنوفر لك لوحة إدارة سكتش سهلة جداً تقدر تضيف منها صور وأسعار وتعدل المخزون في دقيقة، أو تقدر تبعتلنا على الواتساب وفريق الدعم هيحدثهولك فوراً.',
 doodleTip: ' أسهل من كتابة بوست على الفيسبوك أو الإنستجرام.',
 },
 {
 question: 'الأوردرات بتوصلي إزاي أول ما الزبون يطلب؟',
 answer: 'بمجرد ما الزبون يختار منتجاته ومقاسه ويدوس "تأكيد الطلب"، بيوصلك إشعار واتساب فوري منظم فيه: اسم الزبون، رقمه، قائمته، المقاس، الإجمالي، والمحافظة ورابط اللوكيشن، وجاهز للطباعة أو الإرسال لشركة الشحن.',
 doodleTip: ' رسالة جاهزة ومنظمة تريحك من س وج وتفاصيل الشات المرهقة.',
 },
];

export const FaqSection: React.FC = () => {
 const [openIndex, setOpenIndex] = useState<number | null>(0);

 const toggleFaq = (index: number) => {
 playPencilScratch();
 setOpenIndex(openIndex === index ? null : index);
 };

 return (
 <section className="py-16 paper-pattern relative select-none dark:bg-[#0B0F17] transition-colors">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 
 {/* Section Header */}
 <div className="text-center mb-10">
 <div className="inline-block border-2 border-[#0F0F0F] dark:border-slate-700 bg-white dark:bg-[#151D2A] text-[#0F0F0F] dark:text-slate-100 px-3 py-1 sketch-border-tag text-xs font-black -rotate-1 mb-3 sketch-shadow-sm">
 أسئلة شائعة وإجابات واضحة • بالبلدي كده
 </div>

 <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight mb-4 text-[#0F0F0F] dark:text-white">
 كل سؤال بيدور في بالك متجاوب عليه هنا
 </h2>

 <p className="text-base sm:text-lg font-bold text-[#0F0F0F]/80 dark:text-slate-300">
 إجابات واضحة وصريحة بدون أي لف ودوران أو مصطلحات تقنية معقدة.
 </p>
 </div>

 {/* FAQ Accordion List */}
 <div className="space-y-4">
 {FAQS.map((faq, idx) => {
 const isOpen = openIndex === idx;

 return (
 <div
 key={idx}
 className={`border-2.5 border-[#0F0F0F] dark:border-slate-700 transition-all duration-150 ${
 isOpen
 ? 'bg-white dark:bg-[#151D2A] sketch-border-1 sketch-shadow'
 : 'bg-white/90 dark:bg-[#151D2A]/80 sketch-border-2 hover:bg-white dark:hover:bg-[#151D2A] sketch-shadow-sm'
 }`}
 >
 <button
 onClick={() => toggleFaq(idx)}
 className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-black hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors rounded-xl"
 >
 <span className="text-base sm:text-lg font-heading text-[#0F0F0F] dark:text-white">
 {faq.question}
 </span>

 <div className="w-8 h-8 shrink-0 border-2 border-[#0F0F0F] dark:border-slate-700 sketch-border-circle flex items-center justify-center bg-[#FAF9F6] dark:bg-slate-800 text-[#0F0F0F] dark:text-white">
 {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
 </div>
 </button>

 {isOpen && (
 <div className="px-4 pb-5 sm:px-5 sm:pb-6 border-t border-[#0F0F0F]/20 dark:border-slate-700 pt-3 space-y-3">
 <p className="text-sm sm:text-base font-bold text-[#0F0F0F]/85 dark:text-slate-300 leading-relaxed">
 {faq.answer}
 </p>

 <div className="p-2 border border-dashed border-[#0F0F0F] dark:border-orange-500/40 bg-[#FAF9F6] dark:bg-orange-500/10 sketch-border-tag text-xs font-bold text-[#0F0F0F] dark:text-orange-300">
 {faq.doodleTip}
 </div>
 </div>
 )}
 </div>
 );
 })}
 </div>

 </div>

 <HandDrawnDivider variant="squiggly" height={16} className="mt-14 mb-0" />
 </section>
 );
};
