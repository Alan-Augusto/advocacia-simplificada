"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { FAQS } from "../data/content";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 fade-in visible">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-4 block">
            Perguntas Frequentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            Tire suas dúvidas
          </h2>
          <p className="text-base text-slate-500">
            Respostas para as perguntas mais comuns sobre direitos trabalhistas.
          </p>
        </div>

        <div className="space-y-3 fade-in visible">
          {FAQS.map((faq, index) => (
            <div key={index} className="border border-slate-200/80 rounded-2xl overflow-hidden">
              <button 
                onClick={() => toggleAccordion(index)} 
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/50 transition-colors"
              >
                <span className="font-medium text-sm text-slate-900 pr-4">
                  {faq.question}
                </span>
                <Icon 
                  icon="solar:add-circle-linear" 
                  width="20" 
                  className={`text-slate-400 flex-shrink-0 accordion-icon ${openIndex === index ? "rotated" : ""}`} 
                />
              </button>
              <div className={`accordion-content ${openIndex === index ? "open" : ""}`}>
                <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
