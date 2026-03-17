"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-text-primary text-2xl font-light mb-3">
        Something went wrong
      </h1>
      <p className="text-text-muted text-sm mb-6">
        An unexpected error occurred.
      </p>
      <button
        onClick={() => reset()}
        className="text-xs text-accent border border-accent/30 rounded px-3 py-1.5 hover:bg-accent/5 transition-colors"
      >
        Try again
      </button>
    </main>
  );
}
