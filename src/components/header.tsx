import Link from "next/link";

export default function Header() {
  return (
    <header>
      <div className="container mx-auto max-w-7xl px-6 sm:px-8">
        <div className="logo">
          <Link href="/" className="flex items-center no-underline">
            <span className="logo-mark">∞</span>
            <span>MetaSPN</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
