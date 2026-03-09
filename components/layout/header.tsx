import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border-secondary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--layout-radius-md)] focus:bg-surface-primary focus:px-4 focus:py-2 focus:text-content-primary focus:shadow-lg"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          MagicOKLCH
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/catalogue"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Catalogue
          </Link>
          <Link
            href="/random"
            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Random
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
