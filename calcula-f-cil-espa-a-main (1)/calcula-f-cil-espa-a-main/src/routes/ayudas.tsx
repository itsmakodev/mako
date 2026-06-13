import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageShell } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CALCULATORS } from "../lib/calculators/registry";
import { POSTS } from "../lib/blog";
import { HandHeart, Home, Users, Briefcase, Zap, Hammer, Baby, Clock } from "lucide-react";

const SUBCATS: { key: string; label: string; slugs: string[] }[] = [
  { key: "vivienda", label: "Vivienda", slugs: ["calculadora-bono-alquiler-joven", "calculadora-ayuda-rehabilitacion-vivienda"] },
  { key: "familia", label: "Familia", slugs: ["calculadora-deduccion-maternidad", "calculadora-familia-numerosa", "calculadora-ingreso-minimo-vital"] },
  { key: "empleo", label: "Empleo", slugs: ["calculadora-prestacion-desempleo"] },
  { key: "energia", label: "Energía", slugs: ["calculadora-bono-social-electrico"] },
  { key: "autonomos", label: "Autónomos", slugs: ["calculadora-ayudas-autonomos-nuevos"] },
];

const ICONS: Record<string, typeof Home> = {
  "calculadora-ingreso-minimo-vital": HandHeart,
  "calculadora-bono-alquiler-joven": Home,
  "calculadora-bono-social-electrico": Zap,
  "calculadora-deduccion-maternidad": Baby,
  "calculadora-familia-numerosa": Users,
  "calculadora-prestacion-desempleo": Briefcase,
  "calculadora-ayuda-rehabilitacion-vivienda": Hammer,
  "calculadora-ayudas-autonomos-nuevos": Briefcase,
};

export const Route = createFileRoute("/ayudas")({
  head: () => ({
    meta: [
      { title: "Ayudas y subvenciones 2026: simuladores gratis · CalculaFácil" },
      { name: "description", content: "Calcula ayudas públicas en España 2026: IMV, Bono Alquiler Joven, paro, familia numerosa, maternidad, bono social y más. Gratis." },
      { property: "og:title", content: "Ayudas y subvenciones 2026 — simuladores gratis" },
      { property: "og:description", content: "Comprueba a qué ayudas tienes derecho y cuánto puedes cobrar. Datos oficiales 2026." },
      { property: "og:url", content: "/ayudas" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/ayudas" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Ayudas y subvenciones 2026",
        inLanguage: "es-ES",
      }),
    }],
  }),
  component: AyudasPage,
});

function AyudasPage() {
  const ayudas = useMemo(() => CALCULATORS.filter((c) => c.category === "ayudas"), []);
  const [cat, setCat] = useState<string>("all");
  const visible = cat === "all" ? ayudas : ayudas.filter((a) => SUBCATS.find((s) => s.key === cat)?.slugs.includes(a.slug));

  // Mini wizard
  const [wq, setWq] = useState({ situacion: "", empleo: "", edad: "" });
  const suggestions = useMemo(() => {
    const s: string[] = [];
    if (wq.situacion === "alquiler" && (wq.edad === "joven")) s.push("calculadora-bono-alquiler-joven");
    if (wq.empleo === "paro") s.push("calculadora-prestacion-desempleo", "calculadora-ingreso-minimo-vital");
    if (wq.empleo === "autonomo") s.push("calculadora-ayudas-autonomos-nuevos", "calculadora-cuota-autonomo");
    if (wq.situacion === "hijos") s.push("calculadora-deduccion-maternidad", "calculadora-familia-numerosa");
    if (wq.situacion === "energia") s.push("calculadora-bono-social-electrico");
    return Array.from(new Set(s)).slice(0, 3);
  }, [wq]);

  const recentPosts = POSTS.slice(0, 3);

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Ayudas" }]} />

        <section className="py-8 lg:py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <HandHeart className="w-3.5 h-3.5" /> Actualizado 2026
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">¿A qué ayudas tienes derecho?</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">Conocer tus derechos es el primer paso para reclamarlos. Calcula en segundos cuánto puedes cobrar de las principales prestaciones públicas en España 2026.</p>
        </section>

        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => setCat("all")} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${cat === "all" ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:border-foreground"}`}>Todas ({ayudas.length})</button>
          {SUBCATS.map((s) => (
            <button key={s.key} onClick={() => setCat(s.key)} className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${cat === s.key ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:border-foreground"}`}>{s.label}</button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {visible.map((c) => {
            const Icon = ICONS[c.slug] ?? HandHeart;
            return (
              <Link key={c.slug} to="/calculadoras/$slug" params={{ slug: c.slug }}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary hover:shadow-lg transition-all">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 flex items-center justify-center text-white mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors leading-snug">{c.shortTitle ?? c.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{c.time}</div>
              </Link>
            );
          })}
        </div>

        <section className="rounded-3xl border border-border bg-card p-6 lg:p-10 mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-2">¿No sabes por dónde empezar?</h2>
          <p className="text-muted-foreground mb-6">Responde 3 preguntas rápidas y te sugerimos las calculadoras más relevantes.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <SelectField label="Situación" value={wq.situacion} onChange={(v) => setWq((p) => ({ ...p, situacion: v }))}
              options={[["", "Selecciona..."], ["alquiler", "Vivo de alquiler"], ["hijos", "Tengo hijos a cargo"], ["energia", "Me preocupa la factura de luz"]]} />
            <SelectField label="Empleo" value={wq.empleo} onChange={(v) => setWq((p) => ({ ...p, empleo: v }))}
              options={[["", "Selecciona..."], ["empleado", "Asalariado"], ["paro", "En desempleo"], ["autonomo", "Voy a darme de alta como autónomo"]]} />
            <SelectField label="Edad" value={wq.edad} onChange={(v) => setWq((p) => ({ ...p, edad: v }))}
              options={[["", "Selecciona..."], ["joven", "18-35 años"], ["adulto", "36-64"], ["mayor", "65 o más"]]} />
          </div>
          {suggestions.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-foreground mb-2">Te recomendamos:</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {suggestions.map((slug) => {
                  const c = CALCULATORS.find((x) => x.slug === slug);
                  if (!c) return null;
                  return (
                    <Link key={slug} to="/calculadoras/$slug" params={{ slug }}
                      className="rounded-xl border border-primary/30 bg-primary/5 p-4 hover:bg-primary/10 transition-colors">
                      <p className="font-semibold text-sm text-foreground">{c.shortTitle ?? c.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {recentPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-5">Artículos relacionados</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {recentPosts.map((p) => (
                <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }}
                  className="rounded-xl border border-border bg-card p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}