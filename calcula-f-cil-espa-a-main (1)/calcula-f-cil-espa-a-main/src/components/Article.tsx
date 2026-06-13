// Minimal markdown-lite renderer for our calculator + blog articles.
// Supports: ## H2, **bold**, `inline code`, paragraphs, and "- " bullet lists.
import { Fragment } from "react";

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("`")) return <code key={i} className="px-1.5 py-0.5 rounded bg-muted text-foreground text-sm font-mono">{p.slice(1, -1)}</code>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

export function Article({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);
  return (
    <div className="prose-custom space-y-5">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold tracking-tight text-foreground mt-8 first:mt-0">{renderInline(block.slice(3))}</h2>;
        if (block.startsWith("- ")) {
          const items = block.split(/\n- /).map((l) => l.replace(/^- /, ""));
          return <ul key={i} className="list-disc pl-6 space-y-1.5 text-foreground/90">{items.map((it, j) => <li key={j}>{renderInline(it)}</li>)}</ul>;
        }
        return <p key={i} className="text-foreground/90 leading-relaxed">{renderInline(block)}</p>;
      })}
    </div>
  );
}