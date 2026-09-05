import { BrandPanel } from "@/components/auth/BrandPanel";
import { inter } from "@/lib/fonts";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} flex min-h-screen w-full flex-1 flex-col lg:flex-row`}>
      <BrandPanel />
      <div className="flex flex-1 flex-col bg-white px-6 py-12">
        <div className="flex flex-1 flex-col items-center justify-center">
          {/* The form sits directly on the page rather than inside a tinted panel and a
              blue-tinted drop shadow — one less frame between the reader and the fields. */}
          <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-500 sm:px-2">
            {children}
          </div>
        </div>
        <p className="animate-in fade-in pt-10 text-center text-xs text-muted-foreground/60 duration-700">
          Developed by <span className="font-medium text-muted-foreground">Chamath Dilshan</span>
          {" · © "}
          {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
