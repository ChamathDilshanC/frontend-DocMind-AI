"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/** Blinking cursor shown at the end of a message while tokens are still streaming in. */
export function StreamingCursor() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.set(ref.current, { opacity: 1 });
    const tween = gsap.to(ref.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    return () => {
      tween.kill();
    };
  }, []);

  return <span ref={ref} className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 bg-current align-middle" />;
}
