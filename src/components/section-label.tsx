export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-sm font-semibold tracking-[3px] uppercase text-text-primary mb-6">
      {children}
    </div>
  );
}
