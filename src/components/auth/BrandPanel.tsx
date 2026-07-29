import { Typography } from "@heroui/react";
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
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-[#ffc95c]/25 blur-[90px] [animation:float-slow_12s_ease-in-out_infinite]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[#8fa8ff]/30 blur-[100px] [animation:float-slower_14s_ease-in-out_infinite]"
      />

      <div className="relative animate-in fade-in duration-500">
        <span className={`${bricolage.className} text-xl font-bold text-white`}>DocMind AI</span>
      </div>

      <div className="relative mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700 lg:mt-0">
        <Typography.Heading
          level={1}
          className={`${bricolage.className} text-4xl font-extrabold leading-[1.1] tracking-tight text-white lg:text-5xl`}
        >
          Ask your documents,
          <br />
          get answers{" "}
          <span className="relative inline-block">
            faster.
            <span aria-hidden className="absolute inset-x-0 -bottom-1 h-[6px] bg-[#ffc95c]" />
          </span>
        </Typography.Heading>
        <Typography.Paragraph className="mt-5 max-w-md text-white/70">
          Upload a document, ask a question in plain language, and get a grounded answer — no more manually
          searching through pages.
        </Typography.Paragraph>

        <div className="liquid-glass mt-8 max-w-sm rounded-2xl p-5">
          <ul className="space-y-3">
            {highlights.map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <Check className="mt-0.5 shrink-0 text-[#ffc95c]" size={16} />
                <Typography type="body-sm" className="text-white/90">
                  {line}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-10 animate-in fade-in duration-700 delay-150 lg:mt-0">
        <Typography type="body-xs" weight="semibold" className="uppercase tracking-wider text-white/50">
          Built with
        </Typography>
        <div className="mt-3 flex flex-wrap gap-2">
          {builtWith.map((name) => (
            <span
              key={name}
              className="liquid-glass rounded-full px-3 py-1 text-xs font-medium tracking-wide text-white/70"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
