"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SidebarHeader } from "@/components/ui/sidebar";
import { useDocuments } from "@/hooks/useDocuments";
import type { NavItem } from "@/components/sidebar-01/types";

interface NavHeaderProps {
  items: NavItem[];
}

export function NavHeader({ items }: NavHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { data } = useDocuments(1, 10);
  const documents = data?.items ?? [];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const go = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <SidebarHeader className="gap-1">
        {/* The rail had no product identity at all — it opened straight onto a search
            row, so nothing on an inner page said which app you were in. */}
        <Link href="/dashboard" className="flex items-center gap-2 px-2 pt-2 pb-1">
          <Image src="/logo.png" alt="" width={22} height={22} className="shrink-0" />
          <span className="font-semibold text-sm tracking-tight">DocMind AI</span>
        </Link>

        <button
          type="button"
          className="mx-1 flex items-center justify-between rounded-lg border bg-background px-2.5 py-1.5 text-left transition-colors hover:bg-sidebar-accent"
          onClick={() => setOpen(true)}
        >
          <span className="flex flex-1 items-center gap-2.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-normal text-muted-foreground text-sm">Search</span>
          </span>
          <kbd className="inline-flex font-[inherit] font-medium text-muted-foreground/70 text-xs">
            ⌘K
          </kbd>
        </button>
      </SidebarHeader>

      <CommandDialog onOpenChange={setOpen} open={open}>
        <Command>
          <CommandInput placeholder="Jump to a page or document..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              {items.map((item) => (
                <CommandItem className="py-2!" key={item.id} onSelect={() => go(item.url)}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {documents.length > 0 && (
              <>
                <CommandSeparator className="my-2" />
                <CommandGroup heading="Documents">
                  {documents.map((doc) => (
                    <CommandItem
                      className="py-2!"
                      key={doc.id}
                      onSelect={() => go(`/documents/${doc.id}`)}
                    >
                      <span className="truncate">{doc.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
