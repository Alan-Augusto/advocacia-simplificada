import { PROBLEM_STATS } from "../data/content";

export default function ProblemStatement() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center fade-in visible">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-4 block">
            {PROBLEM_STATS.title_badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-6">
            {PROBLEM_STATS.title}
          </h2>
          <p className="text-base text-slate-500 leading-relaxed mb-12">
            {PROBLEM_STATS.description}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 fade-in visible">
          {PROBLEM_STATS.stats.map((stat, index) => (
            <div key={index} className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
              <div className="text-3xl font-semibold tracking-tight text-indigo-600 mb-2">
                {stat.value}
              </div>
              <p className="text-xs text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
