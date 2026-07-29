import { Check } from "lucide-react";
import { bricolage } from "@/lib/fonts";

const highlights = [
  "Grounded in your own PDFs and DOCX files",
  "Answers stream live, with page-level citations",
  "Your documents never leave your own storage",
];

const builtWith = ["ASP.NET Core", "Semantic Kernel", "Qdrant", "Next.js"];

export function BrandPanel() {
  return (
    <div className="relative flex w-full flex-col justify-between overflow-hidden bg-[#2743ff] px-8 py-10 lg:w-1/2 lg:px-16 lg:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#1b34c9 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative">
        <span className={`${bricolage.className} text-xl font-bold text-white`}>DocMind AI</span>
      </div>

      <div className="relative mt-10 lg:mt-0">
        <h1
          className={`${bricolage.className} text-4xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-5xl`}
        >
          Ask your documents,
          <br />
          get answers{" "}
          <span className="relative inline-block">
            faster.
            <span aria-hidden className="absolute inset-x-0 -bottom-1 h-[6px] bg-[#ffc95c]" />
          </span>
        </h1>
        <p className="mt-5 max-w-md text-base text-white/70">
          Upload a document, ask a question in plain language, and get a grounded answer — no more manually
          searching through pages.
        </p>

        <div className="mt-8 max-w-sm rounded-2xl bg-white/[0.06] p-5">
          <ul className="space-y-3">
            {highlights.map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-sm text-white/90">
                <Check className="mt-0.5 shrink-0 text-[#ffc95c]" size={16} />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-10 lg:mt-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Built with</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {builtWith.map((name) => (
            <span key={name} className="text-sm font-medium tracking-wide text-white/60">
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
