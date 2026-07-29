import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://frontend-doc-mind-ai.vercel.app"),
  title: {
    default: "DocMind AI",
    template: "%s · DocMind AI",
  },
  description: "AI-powered document assistant with RAG-based chat over your own PDF and DOCX files.",
  applicationName: "DocMind AI",
  openGraph: {
    title: "DocMind AI",
    description: "AI-powered document assistant with RAG-based chat over your own PDF and DOCX files.",
    images: ["/logo-full.png"],
    siteName: "DocMind AI",
  },
  twitter: {
    card: "summary",
    title: "DocMind AI",
    description: "AI-powered document assistant with RAG-based chat over your own PDF and DOCX files.",
    images: ["/logo-full.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
