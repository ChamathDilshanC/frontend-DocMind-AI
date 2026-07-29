import Image from "next/image";
import Link from "next/link";
import { Code2, FileText, Globe } from "lucide-react";

const productLinks = [
  { label: "About", href: "#about" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Sign up", href: "/register" },
  { label: "Login", href: "/login" },
];

const resourceLinks = [
  { label: "GitHub", href: "https://github.com/ChamathDilshanC/Main-DocMind-AI" },
  { label: "API status", href: "https://docmind-ai-api-onsp.onrender.com" },
  { label: "Documentation", href: "https://github.com/ChamathDilshanC/backend-DocMind-AI#readme" },
];

const socialLinks = [
  { icon: Code2, label: "GitHub", href: "https://github.com/ChamathDilshanC/Main-DocMind-AI" },
  { icon: Globe, label: "API status", href: "https://docmind-ai-api-onsp.onrender.com" },
  { icon: FileText, label: "Documentation", href: "https://github.com/ChamathDilshanC/backend-DocMind-AI#readme" },
];

export function LandingFooter() {
  return (
    <footer className="relative bg-black px-6 pb-10 pt-20 border-t border-white/10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="" width={24} height={24} />
              <span className="text-white font-semibold text-lg">DocMind AI</span>
            </Link>
            <p className="mt-3 max-w-xs text-white/60 text-sm leading-relaxed">
              An AI-powered RAG document assistant — ask questions over your own PDFs and DOCX files, grounded in
              real citations.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="liquid-glass rounded-full p-3 text-white/80 hover:text-white hover:bg-white/5 transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider">Product</h4>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white/40 text-xs font-semibold uppercase tracking-wider">Resources</h4>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} DocMind AI. All rights reserved.</p>
          <p className="text-white/40 text-xs">.NET 8 · Next.js · Semantic Kernel · Qdrant</p>
        </div>
      </div>
    </footer>
  );
}
