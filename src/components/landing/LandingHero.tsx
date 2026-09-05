"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NextLink from "next/link";
import { Button, InputGroup, Link, TextField, Typography } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import { brace } from "@/lib/fonts";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4";
const FADE_MS = 500;
const FADE_OUT_THRESHOLD_S = 0.55;

function animateOpacity(
  video: HTMLVideoElement,
  rafRef: React.MutableRefObject<number | null>,
  to: number,
  duration: number,
) {
  if (rafRef.current !== null) {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }
  const from = parseFloat(video.style.opacity || "0");
  const start = performance.now();

  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    video.style.opacity = String(from + (to - from) * t);
    if (t < 1) {
      rafRef.current = requestAnimationFrame(step);
    } else {
      rafRef.current = null;
    }
  };
  rafRef.current = requestAnimationFrame(step);
}

export function LandingHero() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      animateOpacity(video, rafRef, 1, FADE_MS);
    };

    const handleTimeUpdate = () => {
      if (fadingOutRef.current) return;
      if (!video.duration || Number.isNaN(video.duration)) return;
      if (video.duration - video.currentTime <= FADE_OUT_THRESHOLD_S) {
        fadingOutRef.current = true;
        animateOpacity(video, rafRef, 0, FADE_MS);
      }
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      window.setTimeout(() => {
        video.currentTime = 0;
        fadingOutRef.current = false;
        void video.play();
        animateOpacity(video, rafRef, 1, FADE_MS);
      }, 100);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = email ? `?email=${encodeURIComponent(email)}` : "";
    router.push(`/register${query}`);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover translate-y-[17%]"
        style={{ opacity: 0 }}
        src={VIDEO_URL}
        muted
        autoPlay
        playsInline
      />

      <nav className="relative z-20 pl-6 pr-6 py-6">
        <div className="rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-8">
            <NextLink href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="" width={24} height={24} />
              <span className="text-white font-semibold text-lg">DocMind AI</span>
            </NextLink>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#about" className="text-white/80 hover:text-white text-sm font-medium">
                About
              </Link>
              <Link href="#how-it-works" className="text-white/80 hover:text-white text-sm font-medium">
                How it works
              </Link>
              <Link
                href="https://github.com/ChamathDilshanC/Main-DocMind-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white text-sm font-medium"
              >
                GitHub
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NextLink href="/register" className="text-white text-sm font-medium">
              Sign Up
            </NextLink>
            <NextLink
              href="/login"
              className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium"
            >
              Login
            </NextLink>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <Typography.Heading
          level={1}
          className={`${brace.className} mb-8 text-balance text-4xl text-white tracking-tight sm:text-5xl md:text-6xl lg:text-7xl`}
        >
          Ask your documents
        </Typography.Heading>

        <div className="max-w-xl w-full space-y-4">
          <form onSubmit={handleEmailSubmit}>
            <TextField aria-label="Email" fullWidth isRequired value={email} onChange={setEmail}>
              <InputGroup className="liquid-glass rounded-full pl-4 pr-2 py-2" fullWidth>
                <InputGroup.Input
                  type="email"
                  placeholder="Enter your email"
                  className="text-white placeholder:text-white/40 text-base"
                />
                <InputGroup.Suffix className="pr-0">
                  <Button isIconOnly aria-label="Get started" className="bg-white rounded-full text-black" type="submit">
                    <ArrowRight size={20} />
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>
          </form>

          <Typography.Paragraph className="px-4 text-white/70">
            Upload PDF and DOCX files, ask questions in plain language, and get grounded answers with page-level
            citations — powered by retrieval-augmented generation.
          </Typography.Paragraph>

          <div className="flex justify-center">
            <a
              href="https://docmind-ai-api-onsp.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium"
            >
              See how it works
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
