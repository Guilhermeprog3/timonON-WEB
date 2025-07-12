"use client";

import Link from 'next/link';
import Image from 'next/image';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
      {/* Botão de toggle da sidebar posicionado ao lado da sidebar */}
      <SidebarTrigger className="text-slate-700 hover:text-slate-900" />

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 p-1">
            <Image
              src="/assets/prefeitura-logo.png"
              alt="Zelus Logo"
              width={28}
              height={28}
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Zelus
          </span>
        </Link>
      </div>


      <div className="ml-auto">
      </div>
    </header>
  );
}