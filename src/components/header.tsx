import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div className="container mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex justify-between items-center">
          <div className="logo">
            <Link href="/" className="flex items-center no-underline">
              <Image
                src="/logo.png"
                alt="MetaSPN Logo"
                width={180}
                height={60}
                priority
                className="logo-image"
              />
            </Link>
          </div>
          <nav className="flex gap-6">
            <Link href="/games" className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
              Games
            </Link>
            <Link href="/discover" className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
              Discover
            </Link>
            <Link href="/compare" className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
              Compare
            </Link>
            <Link href="/coordination-game" className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
              Newsletter
            </Link>
            <Link href="/creator-game" className="text-sm font-mono text-muted-foreground hover:text-primary transition-colors">
              Course
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
