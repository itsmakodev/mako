import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CATEGORIES, type CategoryKey } from "../lib/calculators/types";
import { CALCULATORS } from "../lib/calculators/registry";
import { Clock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/calculadoras/")({
  head: () => ({
    meta: [
      { title: "Todas las calculadoras · CalculaFácil" },
      { name: "description", content: "Más de 12 calculadoras gratuitas: hipoteca, IRPF, autónomos, finiquito, interés compuesto y más. Filtra por categoría." },
      { property: "og:title", content: "Todas las calculadoras financieras y fiscales" },
      { property: "og:description", content: "Explora +12 calculadoras gratuitas para España, actualizadas 2026." },
      { property: "og:url", content: "/calculadoras" },
    ],
    links: [{ rel: "canonical", href: "/calculadoras" }],
  }),
  component: ListPage,
});

function ListPage() {
  const [cat, setCat] = useState<CategoryKey | "all">("all");
  const visible = CALCULATORS.filter((c) => cat === "all" || c.category === cat);
  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Calculadoras" }]} />
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Todas las calculadoras</h1>
        <p className="text-muted-foreground max-w-2xl text-lg">Elige la herramienta que necesitas. Todas son gratuitas, sin registro y se actualizan con la normativa vigente.</p>

        <div className="flex flex-wrap gap-2 mt-8 mb-8">
          <button onClick={() => setCat("all")} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${cat === "all" ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:border-foreground"}`}>Todas ({CALCULATORS.length})</button>
          {CATEGORIES.map((c) => {
            const n = CALCULATORS.filter((x) => x.category === c.key).length;
            if (n === 0) return null;
            return (
              <button key={c.key} onClick={() => setCat(c.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${cat === c.key ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:border-foreground"}`}>
                {c.label} ({n})
              </button>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((c) => {
            const category = CATEGORIES.find((x) => x.key === c.category);
            return (
              <Link key={c.slug} to="/calculadoras/$slug" params={{ slug: c.slug }}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary hover:shadow-lg transition-all">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${category?.color} flex items-center justify-center text-white mb-4`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">{c.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{c.time}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${c.difficulty === "Fácil" ? "bg-success/10 text-success" : c.difficulty === "Medio" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{c.difficulty}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}