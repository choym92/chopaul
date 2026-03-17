import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-16 px-6 mx-auto max-w-[720px] min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-text-primary text-2xl font-light mb-3">
          Page not found
        </h1>
        <p className="text-text-muted text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="text-xs text-accent hover:text-text-primary transition-colors underline underline-offset-2"
        >
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
