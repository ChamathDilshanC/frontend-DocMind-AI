import { Layers, MessageSquareText, Quote, UploadCloud } from "lucide-react";
import { brace } from "@/lib/fonts";
import { Reveal } from "./Reveal";

const steps = [
  {
    icon: UploadCloud,
    title: "Upload",
    body: "Drop in a PDF or DOCX. It's validated and queued for background processing right away.",
  },
  {
    icon: Layers,
    title: "Understand",
    body: "The pipeline extracts the text, splits it into overlapping chunks, and embeds every passage.",
  },
  {
    icon: MessageSquareText,
    title: "Ask",
    body: "Ask a question in plain language — no special syntax, just type what you want to know.",
  },
  {
    icon: Quote,
    title: "Get a cited answer",
    body: "The model answers using only the retrieved passages, streamed live with page-level citations.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative bg-black px-6 py-28 border-t border-white/10">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className={`${brace.className} text-4xl md:text-5xl text-white mb-6 tracking-tight`}>How it works</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-white/70 text-base leading-relaxed">
            From upload to a grounded answer, in four steps.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={150 + i * 100}>
            <div className="liquid-glass rounded-3xl p-8 h-full">
              <span className="text-white/40 text-sm font-medium">{String(i + 1).padStart(2, "0")}</span>
              <step.icon className="mt-3 text-white/80" size={24} />
              <h3 className="mt-4 text-white font-semibold text-lg">{step.title}</h3>
              <p className="mt-2 text-white/60 text-sm leading-relaxed">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
