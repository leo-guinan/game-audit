import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header>
      <div className="container mx-auto max-w-7xl px-6 sm:px-8">
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
      </div>
    </header>
  );
}
