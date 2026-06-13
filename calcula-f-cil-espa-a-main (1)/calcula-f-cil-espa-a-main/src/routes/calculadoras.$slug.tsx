import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Calculator } from "../components/Calculator";
import { Article } from "../components/Article";
import { FaqAccordion } from "../components/Faq";
import { AdSlot } from "../components/AdSlot";
import { getCalculator, CALCULATORS } from "../lib/calculators/registry";
import { CATEGORIES } from "../lib/calculators/types";
import { Clock, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/calculadoras/$slug")({
  loader: ({ params }) => {
    const calc = getCalculator(params.slug);
    if (!calc) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const c = getCalculator(params.slug);
    if (!c) return {};
    return {
      meta: [
        { title: `${c.title} · CalculaFácil` },
        { name: "description", content: c.longDescription },
        { property: "og:title", content: c.title },
        { property: "og:description", content: c.longDescription },
        { property: "og:url", content: `/calculadoras/${params.slug}` },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `/calculadoras/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: c.faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
              { "@type": "ListItem", position: 2, name: "Calculadoras", item: "/calculadoras" },
              { "@type": "ListItem", position: 3, name: c.title, item: `/calculadoras/${params.slug}` },
            ],
          }),
        },
      ],
    };
  },
  component: CalcPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Calculadora no encontrada</h1>
        <Link to="/calculadoras" className="text-primary hover:underline mt-4 inline-block">Ver todas las calculadoras</Link>
      </div>
    </PageShell>
  ),
});

function CalcPage() {
  const { slug } = Route.useLoaderData();
  const calc = getCalculator(slug)!;
  const category = CATEGORIES.find((c) => c.key === calc.category);
  const related = ((calc.related ?? []) as string[])
    .map((s: string) => CALCULATORS.find((c) => c.slug === s))
    .filter((x): x is NonNullable<typeof x> => !!x);

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-10">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Calculadoras", to: "/calculadoras" }, { label: calc.shortTitle ?? calc.title }]} />

        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{category?.label}</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" />{calc.time}</span>
            <span className="inline-flex items-center gap-1 text-success"><BadgeCheck className="w-3.5 h-3.5" />Actualizado 2026</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">{calc.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{calc.longDescription}</p>
        </header>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-10 min-w-0">
            <Calculator def={calc} />

            <section>
              <Article content={calc.article} />
            </section>

            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-5">Preguntas frecuentes</h2>
              <FaqAccordion faqs={calc.faqs} />
            </section>

            {related.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold tracking-tight mb-5">Calculadoras relacionadas</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {related.map((r: typeof CALCULATORS[number]) => (
                    <Link key={r.slug} to="/calculadoras/$slug" params={{ slug: r.slug }}
                      className="rounded-xl border border-border bg-card p-5 hover:border-primary transition-colors">
                      <h3 className="font-semibold text-foreground mb-1">{r.shortTitle ?? r.title}</h3>
                      <p className="text-sm text-muted-foreground">{r.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <AdSlot width={300} height={600} label="Publicidad" />
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-3">Más calculadoras</h3>
              <ul className="space-y-2 text-sm">
                {CALCULATORS.filter((c) => c.slug !== calc.slug).slice(0, 6).map((c) => (
                  <li key={c.slug}>
                    <Link to="/calculadoras/$slug" params={{ slug: c.slug }} className="text-muted-foreground hover:text-primary block">
                      → {c.shortTitle ?? c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}