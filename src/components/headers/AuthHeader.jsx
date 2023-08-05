import Link from "next/link";
import Image from "next/image";

// Header component for authentication pages.

export default function AuthHeader() {
  return (
    <header className="mx-auto flex h-14 border-b-[1px] border-light-gray px-4 py-3.5 xl:mb-[50px] xl:max-w-[360px] xl:border-0 xl:pb-8 xl:pt-[67.03px]">
      <Link href="/">
        <Image
          src="/logos/logo.svg"
          width="102"
          height="32"
          alt="logo"
          className="h-[32px] w-[102px]"
          priority
        />
      </Link>
    </header>
  );
}
