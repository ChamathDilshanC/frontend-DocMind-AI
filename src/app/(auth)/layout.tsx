import { BrandPanel } from "@/components/auth/BrandPanel";
import { inter } from "@/lib/fonts";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} flex min-h-screen w-full flex-1 flex-col lg:flex-row`}>
      <BrandPanel />
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
