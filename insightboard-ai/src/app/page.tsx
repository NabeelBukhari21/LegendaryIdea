import Hero from "@/components/landing/Hero";
import FeatureCard from "@/components/landing/FeatureCard";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How{" "}
            <span className="gradient-text">InsightBoard AI</span>{" "}
            Works
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            A complete learning intelligence loop — from detection to reflection to improvement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-light">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            }
            title="Real-Time Engagement Detection"
            description="AI monitors engagement signals during lectures and maps dips to specific slides and topics — no video stored, no surveillance."
            badge="Powered by Presage"
            accentColor="bg-accent/20"
          />
          <FeatureCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            }
            title="AI Recaps & Simpler Explanations"
            description="When engagement drops, Gemini generates a personalized recap and a simpler explanation of the confusing topic."
            badge="Powered by Gemini"
            accentColor="bg-success/20"
          />
          <FeatureCard
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            title="Aggregated Teacher Insights"
            description="Teachers see class-level patterns and AI recommendations — never raw student data. Teaching support, not student profiling."
            badge="Privacy First"
            accentColor="bg-warning/20"
          />
        </div>

        {/* Workflow steps */}
        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: "1", label: "Detect", desc: "Engagement dip detected" },
            { step: "2", label: "Map", desc: "Linked to current slide" },
            { step: "3", label: "Reflect", desc: "Student shares why" },
            { step: "4", label: "Recap", desc: "AI generates explanation" },
            { step: "5", label: "Improve", desc: "Teacher gets insights" },
          ].map((item, i) => (
            <div key={i} className="glass-card p-5 text-center relative">
              <div className="w-8 h-8 rounded-full bg-accent/20 text-accent-light mx-auto mb-3 flex items-center justify-center text-sm font-bold">
                {item.step}
              </div>
              <h4 className="font-semibold text-foreground mb-1">{item.label}</h4>
              <p className="text-xs text-muted">{item.desc}</p>
              {i < 4 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 text-center text-muted">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
