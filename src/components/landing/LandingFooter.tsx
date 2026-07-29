import { Link, Typography } from "@heroui/react";
import { Code2, FileText, Globe } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";

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

const linkClassName = "text-white/70 hover:text-white text-sm";

export function LandingFooter() {
  return (
    <footer className="relative bg-black px-6 pb-10 pt-20 border-t border-white/10">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <NextLink href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="" width={24} height={24} />
              <span className="text-white font-semibold text-lg">DocMind AI</span>
            </NextLink>
            <Typography.Paragraph className="mt-3 max-w-xs text-white/60" size="sm">
              An AI-powered RAG document assistant — ask questions over your own PDFs and DOCX files, grounded in
              real citations.
            </Typography.Paragraph>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="liquid-glass rounded-full p-3 text-white/80 hover:text-white hover:bg-white/5"
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <Typography type="body-xs" weight="semibold" className="uppercase tracking-wider text-white/40">
              Product
            </Typography>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="#about" className={linkClassName}>
                  About
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className={linkClassName}>
                  How it works
                </Link>
              </li>
              <li>
                <NextLink href="/register" className={linkClassName}>
                  Sign up
                </NextLink>
              </li>
              <li>
                <NextLink href="/login" className={linkClassName}>
                  Login
                </NextLink>
              </li>
            </ul>
          </div>

          <div>
            <Typography type="body-xs" weight="semibold" className="uppercase tracking-wider text-white/40">
              Resources
            </Typography>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <Typography type="body-xs" className="text-white/40">
            © {new Date().getFullYear()} DocMind AI. All rights reserved.
          </Typography>
          <Typography type="body-xs" className="text-white/40">
            .NET 8 · Next.js · Semantic Kernel · Qdrant
          </Typography>
        </div>
      </div>
    </footer>
  );
}
