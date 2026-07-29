import Image from "next/image";
import { UserMenu } from "@/components/layout/UserMenu";

export function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2 font-semibold md:hidden">
        <Image src="/logo.png" alt="DocMind AI" width={24} height={24} />
        DocMind AI
      </div>
      <div className="ml-auto">
        <UserMenu />
      </div>
    </header>
  );
}
