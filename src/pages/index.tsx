import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <p className="text-5xl font-bold text-gray-800 dark:text-gray-200">
          Sample page which shows client information.
        </p>
        <p className="text-2xl dark:text-gray-400">Data comes from `navigator` object. Further data comes from `ip-api.com` and `api.ipify.org`.</p>
        <Link
          href="/user-info"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          View client information
        </Link>
      </main>
    </div>
  );
}
