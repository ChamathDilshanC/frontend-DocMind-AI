import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted/40 p-4">
      <Image src="/logo-full.png" alt="DocMind AI" width={200} height={56} priority />
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
