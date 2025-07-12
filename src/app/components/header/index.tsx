"use client";

import Link from 'next/link';
import Image from 'next/image';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-primary/20 bg-primary px-6 text-primary-foreground shadow-md">
      <SidebarTrigger className="text-primary-foreground/80 hover:text-primary-foreground" />

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg p-1">
            <Image
              src="/assets/prefeitura-logo.png"
              alt="Logo da Prefeitura"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Zelus
          </span>
        </Link>
      </div>

      <div className="ml-auto">
      </div>
    </header>
  );
}