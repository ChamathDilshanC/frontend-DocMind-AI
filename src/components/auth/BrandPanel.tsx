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
    // A calm surface, not a poster: the dot grid, two blurred colour blobs and the
    // highlighter stroke were three separate effects competing with the sign-in form
    // that is the only thing anyone comes to this page to use.
    <div className="relative flex w-full flex-col justify-between overflow-hidden bg-[#141519] px-8 py-10 lg:w-1/2 lg:px-16 lg:py-14">

      <div className="relative animate-in fade-in duration-500">
        <span className={`${bricolage.className} text-xl font-bold text-white`}>DocMind AI</span>
      </div>

      <div className="relative mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700 lg:mt-0">
        <Typography.Heading
          level={1}
          className={`${bricolage.className} text-4xl font-semibold leading-[1.15] tracking-tight text-white lg:text-[2.75rem]`}
        >
          Ask your documents,
          <br />
          get answers faster.
        </Typography.Heading>
        <Typography.Paragraph className="mt-5 max-w-md text-white/60">
          Upload a document, ask a question in plain language, and get a grounded answer — no more manually
          searching through pages.
        </Typography.Paragraph>

        <div className="mt-8 max-w-sm rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <ul className="space-y-3">
            {highlights.map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <Check className="mt-0.5 shrink-0 text-white/40" size={16} />
                <Typography type="body-sm" className="text-white/80">
                  {line}
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-10 animate-in fade-in duration-700 delay-150 lg:mt-0">
        <Typography type="body-xs" weight="semibold" className="uppercase tracking-wider text-white/35">
          Built with
        </Typography>
        <div className="mt-3 flex flex-wrap gap-2">
          {builtWith.map((name) => (
            <span
              key={name}
              className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium tracking-wide text-white/55"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
