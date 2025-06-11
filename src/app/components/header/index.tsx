import Link from 'next/link';
import Image from 'next/image';


export function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-slate-900 px-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-3 transition-opacity hover:opacity-80"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
          <Image
            src="/public/assets/prefeitura-logo.png"
            alt="Zelus Logo"
            width={22}
            height={22}
          />
        </div>

        <span className="text-xl font-bold tracking-tight text-white">
          Zelus
        </span>
      </Link>

      <div className="ml-auto">
      </div>
    </header>
  );
}