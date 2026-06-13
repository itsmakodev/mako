import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Calculator as CalcIcon, Search, ShieldCheck, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageShell } from "../components/Layout";
import { CATEGORIES } from "../lib/calculators/types";
import { CALCULATORS, POPULAR_SLUGS } from "../lib/calculators/registry";
import { POSTS } from "../lib/blog";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CalculaFácil · Calculadoras de hipoteca, IRPF y autónomos 2026" },
      { name: "description", content: "+12 calculadoras gratuitas para España: hipoteca, IRPF 2026, salario neto, autónomos, finiquito, interés compuesto. Resultados al instante con datos oficiales." },
      { property: "og:title", content: "CalculaFácil · Calculadoras financieras y fiscales gratuitas" },
      { property: "og:description", content: "+12 calculadoras para España actualizadas 2026. Hipoteca, IRPF, autónomos, finiquito y más." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const matches = q.trim().length > 1
    ? CALCULATORS.filter((c) => (c.title + " " + c.description).toLowerCase().includes(q.toLowerCase())).slice(0, 5)
    : [];
  const popular = POPULAR_SLUGS.map((s) => CALCULATORS.find((c) => c.slug === s)!).filter(Boolean);
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/30" aria-hidden />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border text-xs text-muted-foreground mb-5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Actualizado 2026 · Datos oficiales AEAT · Gratuito
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
              Las calculadoras<br />que tu <span className="text-primary">dinero</span> necesita.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Hipoteca, IRPF, autónomos, finiquito, interés compuesto… Resuelve tus dudas financieras y fiscales en segundos, con datos oficiales de España 2026.
            </p>
            <div className="mt-8 relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="¿Qué quieres calcular?"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card shadow-lg shadow-primary/5 focus:outline-none focus:ring-2 focus:ring-ring text-base"
              />
              {matches.length > 0 && (
                <div className="absolute top-full mt-2 inset-x-0 bg-card border border-border rounded-xl shadow-xl z-10 divide-y divide-border overflow-hidden">
                  {matches.map((c) => (
                    <Link key={c.slug} to="/calculadoras/$slug" params={{ slug: c.slug }} className="block px-4 py-3 hover:bg-muted">
                      <div className="font-medium text-sm">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{c.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Explora por categoría</h2>
        <p className="text-muted-foreground mb-8">Cada herramienta incluye explicación detallada y normativa aplicable.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => {
            const count = CALCULATORS.filter((x) => x.category === c.key).length;
            return (
              <Link key={c.key} to="/calculadoras" search={{ cat: c.key } as never}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white mb-4`}>
                  <CalcIcon className="w-6 h-6" />
                </div>
                <div className="font-semibold text-foreground">{c.label}</div>
                <div className="text-sm text-muted-foreground mt-1">{count} {count === 1 ? "calculadora" : "calculadoras"}</div>
                <ArrowRight className="absolute top-6 right-6 w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Calculadoras populares</h2>
            <p className="text-muted-foreground mt-2">Las más usadas por miles de personas cada mes.</p>
          </div>
          <Link to="/calculadoras" className="text-sm font-medium text-primary hover:underline shrink-0">Ver todas →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popular.map((c) => (
            <Link key={c.slug} to="/calculadoras/$slug" params={{ slug: c.slug }}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-medium uppercase tracking-wide text-primary">{CATEGORIES.find((x) => x.key === c.category)?.label}</div>
                <span className="text-xs text-muted-foreground">{c.time}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-muted/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 grid md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Datos oficiales AEAT", desc: "Tramos IRPF, RETA y normativa actualizada 2026." },
            { icon: CheckCircle2, title: "100% gratuito", desc: "Sin registro, sin email. Calcula todas las veces que quieras." },
            { icon: Sparkles, title: "Privacidad total", desc: "Tus datos nunca salen de tu navegador." },
          ].map((b, i) => (
            <div key={i} className="flex gap-4">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <b.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-foreground">{b.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Últimos artículos</h2>
            <p className="text-muted-foreground mt-2">Guías prácticas sobre finanzas, fiscalidad y trabajo en España.</p>
          </div>
          <Link to="/blog" className="text-sm font-medium text-primary hover:underline shrink-0">Ver blog →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {POSTS.slice(0, 3).map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors">
              <div className="text-xs font-medium uppercase tracking-wide text-primary mb-2">{p.category}</div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{p.excerpt}</p>
              <div className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })} · {p.readMinutes} min</div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
