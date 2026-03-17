export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-6">
      {children}
    </div>
  );
}
