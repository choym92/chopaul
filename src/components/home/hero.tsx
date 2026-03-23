export function Hero() {
  return (
    <section id="top" className="min-h-[80vh] flex items-end px-6 pb-16 pt-24">
      <div className="mx-auto max-w-[1200px] w-full flex justify-between items-end">
        <div>
          <h1
            className="text-text-primary font-bold leading-[0.9] tracking-tighter"
            style={{ fontSize: "clamp(72px, 10vw, 140px)" }}
          >
            Building<br />tools that<br />think.
          </h1>
          <p className="font-mono text-[13px] text-text-muted mt-6">
            Youngmin Cho
          </p>
        </div>
        <div className="hidden md:block w-[320px] h-[400px] bg-surface border border-border rounded-2xl flex-shrink-0 mb-8" />
      </div>
    </section>
  );
}
