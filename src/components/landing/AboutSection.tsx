import { FileSearch, Lock, Zap } from "lucide-react";
import { brace } from "@/lib/fonts";
import { Reveal } from "./Reveal";

const points = [
  {
    icon: FileSearch,
    title: "Grounded answers",
    body: "Every response is backed by real passages pulled straight from your own PDFs and DOCX files — not a guess.",
  },
  {
    icon: Zap,
    title: "Real-time streaming",
    body: "Answers stream token-by-token over SignalR the moment retrieval finishes, instead of waiting on a full response.",
  },
  {
    icon: Lock,
    title: "Your documents, your data",
    body: "Uploads are isolated per account in your own vector index, database, and storage — nothing is shared across users.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative bg-black px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className={`${brace.className} text-4xl md:text-5xl text-white mb-6 tracking-tight`}>
            Built to understand your documents
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-white/70 text-base leading-relaxed">
            DocMind AI is a retrieval-augmented assistant: upload a document, ask a question in plain language, and
            get an answer grounded in the exact pages it came from — with citations you can check yourself.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3">
        {points.map((point, i) => (
          <Reveal key={point.title} delay={150 + i * 100}>
            <div className="liquid-glass rounded-3xl p-8 h-full">
              <point.icon className="text-white/80" size={24} />
              <h3 className="mt-4 text-white font-semibold text-lg">{point.title}</h3>
              <p className="mt-2 text-white/60 text-sm leading-relaxed">{point.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
