import { Icon } from "@iconify/react";
import { TRUST_BAR } from "../data/content";

export default function TrustBar() {
  return (
    <section className="border-y border-slate-100 bg-white py-6 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {TRUST_BAR.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-slate-400">
              <Icon 
                icon={item.icon} 
                width="20" 
                style={item.color ? { color: item.color } : undefined}
              />
              <span className="text-xs font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
