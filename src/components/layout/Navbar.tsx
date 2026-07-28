import { UserMenu } from "@/components/layout/UserMenu";

export function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="md:hidden font-semibold">DocMind AI</div>
      <div className="ml-auto">
        <UserMenu />
      </div>
    </header>
  );
}
