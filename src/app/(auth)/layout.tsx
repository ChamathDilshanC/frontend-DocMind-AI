import { BrandPanel } from "@/components/auth/BrandPanel";
import { inter } from "@/lib/fonts";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} flex min-h-screen w-full flex-1 flex-col lg:flex-row`}>
      <BrandPanel />
      <div className="flex flex-1 flex-col bg-[#f7f8fc] px-6 py-12">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 rounded-3xl border border-black/5 bg-white p-12 shadow-[0_2px_8px_-4px_rgba(15,23,42,0.08),0_24px_48px_-24px_rgba(39,67,255,0.25)] duration-500 sm:p-14">
            {children}
          </div>
        </div>
        <p className="animate-in fade-in pt-10 text-center text-xs text-[#5b6478]/50 duration-700">
          Developed by <span className="font-medium text-[#5b6478]/70">Chamath Dilshan</span>
          {" · © "}
          {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
