import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { POSTS } from "../lib/blog";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog · Finanzas y fiscalidad en España · CalculaFácil" },
      { name: "description", content: "Guías prácticas sobre IRPF, hipotecas, autónomos, criptomonedas y deducciones autonómicas. Actualizado 2026." },
      { property: "og:title", content: "Blog de finanzas y fiscalidad · CalculaFácil" },
      { property: "og:description", content: "Guías prácticas actualizadas sobre fiscalidad y finanzas personales en España." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Blog" }]} />
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Blog</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">Análisis, guías y novedades sobre fiscalidad, hipotecas y finanzas personales en España.</p>
        <div className="grid md:grid-cols-2 gap-5 mt-10">
          {POSTS.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary hover:shadow-lg transition-all">
              <div className="text-xs font-medium uppercase tracking-wide text-primary mb-2">{p.category}</div>
              <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">{p.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.excerpt}</p>
              <div className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })} · {p.readMinutes} min</div>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}