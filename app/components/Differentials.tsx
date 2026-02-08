import { Icon } from "@iconify/react";
import { DIFFERENTIALS, STEPS } from "../data/content";

export default function Differentials() {
  return (
    <section id="diferenciais" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="fade-in visible">
            <span className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-4 block">
              Diferenciais
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-6">
              Por que escolher o
              <br />
              Dr. Luciano?
            </h2>
            <p className="text-base text-slate-500 leading-relaxed mb-10">
              Mais do que representar, o objetivo é empoderar cada cliente com
              conhecimento sobre seus direitos e conduzir cada caso com total
              dedicação.
            </p>

            <div className="space-y-6">
              {DIFFERENTIALS.map((diff, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <Icon icon={diff.icon} width="20" className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-slate-900 mb-1">
                      {diff.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {diff.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-in visible">
            <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
                  <Icon icon="solar:chat-round-dots-linear" width="14" />
                  Como funciona
                </div>
                <h3 className="text-2xl font-semibold tracking-tight mb-8">
                  Do contato à resolução
                </h3>
                <div className="space-y-6">
                  {STEPS.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      {index < STEPS.length - 1 ? (
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold">
                            {step.number}
                          </div>
                          <div className="w-0.5 h-full bg-white/10 mt-2"></div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Icon icon="solar:check-read-linear" width="14" />
                          </div>
                        </div>
                      )}
                      <div className={index < STEPS.length - 1 ? "pb-6" : ""}>
                        <h4 className="font-medium text-sm mb-1">{step.title}</h4>
                        <p className="text-sm text-white/50">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
