import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Article } from "../components/Article";
import { AdSlot } from "../components/AdSlot";
import { getPost, POSTS } from "../lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.post;
    if (!p) return {};
    return {
      meta: [
        { title: `${p.title} · CalculaFácil` },
        { name: "description", content: p.excerpt },
        { property: "og:title", content: p.title },
        { property: "og:description", content: p.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        { property: "article:published_time", content: p.date },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          datePublished: p.date,
          author: { "@type": "Organization", name: "CalculaFácil" },
          publisher: { "@type": "Organization", name: "CalculaFácil" },
        }),
      }],
    };
  },
  component: BlogPost,
  notFoundComponent: () => (
    <PageShell><div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Artículo no encontrado</h1>
      <Link to="/blog" className="text-primary mt-4 inline-block">← Volver al blog</Link>
    </div></PageShell>
  ),
});

function toc(content: string) {
  return content.split("\n").filter((l) => l.startsWith("## ")).map((l) => l.slice(3));
}

function BlogPost() {
  const { post } = Route.useLoaderData();
  const headings = toc(post.content);
  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  return (
    <PageShell>
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Blog", to: "/blog" }, { label: post.title }]} />
        <div className="grid lg:grid-cols-[1fr_280px] gap-10">
          <article className="min-w-0">
            <div className="text-xs font-medium uppercase tracking-wide text-primary mb-2">{post.category}</div>
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">{post.title}</h1>
            <div className="text-sm text-muted-foreground mb-8">{new Date(post.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })} · {post.readMinutes} min de lectura</div>
            <Article content={post.content} />
            {others.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold tracking-tight mb-5">Sigue leyendo</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {others.map((p) => (
                    <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="rounded-xl border border-border bg-card p-5 hover:border-primary transition-colors">
                      <div className="text-xs font-medium uppercase tracking-wide text-primary mb-1.5">{p.category}</div>
                      <h3 className="font-semibold leading-snug">{p.title}</h3>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {headings.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">En este artículo</h3>
                <ul className="space-y-2 text-sm">
                  {headings.map((h, i) => <li key={i} className="text-muted-foreground">• {h}</li>)}
                </ul>
              </div>
            )}
            <AdSlot width={300} height={250} label="Publicidad" />
          </aside>
        </div>
      </div>
    </PageShell>
  );
}