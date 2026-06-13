import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "../lib/calculators/types";

export function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border border border-border rounded-xl bg-card">
      {faqs.map((f, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/40 transition-colors"
            aria-expanded={open === i}
          >
            <span className="font-semibold text-foreground">{f.question}</span>
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{f.answer}</div>}
        </div>
      ))}
    </div>
  );
}