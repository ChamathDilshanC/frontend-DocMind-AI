import { Bricolage_Grotesque, Inter } from "next/font/google";
import localFont from "next/font/local";

export const brace = localFont({
  src: "../fonts/brace.otf",
  variable: "--font-brace",
  display: "swap",
});

export const SF_PRO_STACK =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});
