import { Link } from "@tanstack/react-router";
import { Calculator, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { CATEGORIES } from "../lib/calculators/types";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-foreground">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground">
            <Calculator className="w-5 h-5" />
          </div>
          <span className="text-lg tracking-tight">Calcula<span className="text-primary">Fácil</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link to="/calculadoras" className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">Calculadoras</Link>
          <Link to="/ayudas" className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">Ayudas</Link>
          <Link to="/blog" className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">Blog</Link>
          <Link to="/quienes-somos" className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">Quiénes somos</Link>
        </nav>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1 text-sm">
          <Link to="/calculadoras" onClick={() => setOpen(false)} className="block py-2">Calculadoras</Link>
          <Link to="/ayudas" onClick={() => setOpen(false)} className="block py-2">Ayudas</Link>
          <Link to="/blog" onClick={() => setOpen(false)} className="block py-2">Blog</Link>
          <Link to="/quienes-somos" onClick={() => setOpen(false)} className="block py-2">Quiénes somos</Link>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 font-bold text-foreground mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground">
              <Calculator className="w-4 h-4" />
            </div>
            CalculaFácil
          </div>
          <p className="text-muted-foreground leading-relaxed">Calculadoras financieras y fiscales gratuitas, actualizadas con la normativa española 2026.</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-3">Categorías</h3>
          <ul className="space-y-2 text-muted-foreground">
            {CATEGORIES.map((c) => (
              <li key={c.key}>
                <Link to="/calculadoras" search={{ cat: c.key } as never} className="hover:text-foreground">{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-3">Recursos</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/calculadoras" className="hover:text-foreground">Todas las calculadoras</Link></li>
            <li><Link to="/quienes-somos" className="hover:text-foreground">Quiénes somos</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-3">Legal</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/aviso-legal" className="hover:text-foreground">Aviso legal</Link></li>
            <li><Link to="/politica-privacidad" className="hover:text-foreground">Política de privacidad</Link></li>
            <li><Link to="/politica-cookies" className="hover:text-foreground">Política de cookies</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CalculaFácil · Datos meramente informativos. No constituyen asesoramiento financiero o fiscal.
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}