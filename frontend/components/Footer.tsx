export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-faint md:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[radial-gradient(circle_at_30%_30%,#7df9d0,#6ea8fe_50%,#b68cff)]">
            <span className="h-2 w-2 rounded-full bg-night" />
          </span>
          <span className="font-display font-bold text-muted">Aura Mobile</span>
        </div>
        <p>Certified pre-owned iPhones · Cape Town, South Africa</p>
        <p>© {new Date().getFullYear()} Aura Mobile</p>
      </div>
    </footer>
  );
}
