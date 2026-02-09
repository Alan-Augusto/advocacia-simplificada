import { Icon } from "@iconify/react";
import { Step } from "../types";

interface StepIndicatorProps {
  currentStep: Step;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const getStepStatus = (s: Step) => {
    const order = { "selection": 1, "contact": 2, "chat": 3 };
    const currentOrder = order[currentStep];
    const stepOrder = order[s];
    if (stepOrder < currentOrder) return "completed";
    if (stepOrder === currentOrder) return "current";
    return "upcoming";
  };

  const steps = [
    { id: "selection", label: "Tema", icon: "solar:widget-2-linear" },
    { id: "contact", label: "Identificação", icon: "solar:user-id-linear" },
    { id: "chat", label: "Atendimento", icon: "solar:chat-line-linear" }
  ];

  return (
    <header className="my-2">
      <h1 className="text-xl font-bold text-slate-900 tracking-tight text-center mb-3">
        Advocacia Simplificada
      </h1>

      {/* Stepper UI */}
      <div className="flex items-center justify-center gap-0">
        {steps.map((s, idx) => {
          const status = getStepStatus(s.id as Step);
          const isCompleted = status === 'completed';
          const nextStep = steps[idx + 1];
          const nextStatus = nextStep ? getStepStatus(nextStep.id as Step) : null;
          const lineActive = isCompleted || (status === 'current' && nextStatus === 'current');
          
          return (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${status === 'completed' || status === 'current'
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-slate-300 text-slate-400'
                  }`}>
                  {status === 'completed' ? (
                    <Icon icon="solar:check-read-linear" width="16" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${status === 'current' ? 'text-indigo-600' : 'text-slate-500'
                  }`}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-12 sm:w-16 h-0.5 mx-2 mb-5 transition-all ${isCompleted ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              )}
            </div>
          )
        })}
      </div>
    </header>
  );
}
