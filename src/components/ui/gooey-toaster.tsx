"use client";

import { GooeyToaster as GooeyToasterPrimitive, type GooeyToasterProps } from "goey-toast";
import "goey-toast/styles.css";

export function GooeyToaster(props: GooeyToasterProps) {
  return <GooeyToasterPrimitive theme="light" richColors {...props} />;
}
