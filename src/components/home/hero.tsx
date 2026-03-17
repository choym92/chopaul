export function Hero() {
  return (
    <section id="top" className="min-h-[80vh] flex items-end px-6 pb-16 pt-24">
      <div className="mx-auto max-w-[1200px] w-full flex justify-between items-end">
        <h1 className="text-text-primary font-normal leading-[0.9] tracking-tighter" style={{ fontSize: "clamp(80px, 12vw, 160px)" }}>
          Data<br />Scientist
        </h1>
        <div className="hidden md:block w-[320px] h-[400px] bg-surface rounded-2xl flex-shrink-0 mb-8" />
      </div>
    </section>
  );
}
