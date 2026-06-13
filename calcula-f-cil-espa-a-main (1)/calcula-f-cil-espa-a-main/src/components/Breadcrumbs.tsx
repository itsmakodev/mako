import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {it.to ? (
              <Link to={it.to} className="hover:text-foreground transition-colors">{it.label}</Link>
            ) : (
              <span className="text-foreground font-medium">{it.label}</span>
            )}
            {i < items.length - 1 && <ChevronRight className="w-3 h-3" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}