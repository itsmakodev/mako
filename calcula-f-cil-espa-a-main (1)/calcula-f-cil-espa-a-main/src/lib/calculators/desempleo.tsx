import type { CalculatorDef } from "./types";
import { eur } from "../format";
import { Metric } from "../../components/Metric";
import { IPREM_MONTHLY } from "../tax-spain";

interface R { duration: number; first180: number; after: number; total: number; min: number; max: number; eligible: boolean }

export const desempleo: CalculatorDef<R> = {
  slug: "calculadora-prestacion-desempleo",
  title: "Calculadora Prestación por Desempleo 2026 (Paro)",
  shortTitle: "Paro / Desempleo",
  description: "Calcula tu prestación contributiva por desempleo: cuantía mensual, duración y topes 2026.",
  longDescription: "Simulador del paro contributivo según LGSS, con tramos del 70% y 60% e IPREM 2026.",
  category: "ayudas",
  icon: "Briefcase",
  time: "2 min",
  difficulty: "Medio",
  fields: [
    { id: "months", label: "Meses cotizados en los últimos 6 años", type: "number", defaultValue: 24, min: 0, max: 72, step: 1 },
    { id: "salary", label: "Salario bruto mensual medio (últ. 180 días)", type: "number", defaultValue: 1800, min: 0, max: 8000, step: 10, unit: "€" },
    { id: "children", label: "Hijos a cargo", type: "number", defaultValue: 0, min: 0, max: 6, step: 1 },
  ],
  calculate: (v) => {
    const months = +v.months;
    const eligible = months >= 12;
    const duration = Math.min(24, Math.floor(months / 3));
    const base = +v.salary; // base reguladora aproximada
    let first180 = base * 0.70;
    let after = base * 0.60;
    const children = +v.children;
    const min = (children > 0 ? 1.07 : 0.80) * IPREM_MONTHLY;
    const maxFactor = children >= 2 ? 2.25 : children === 1 ? 2.00 : 1.75;
    const max = maxFactor * IPREM_MONTHLY;
    first180 = Math.min(max, Math.max(min, first180));
    after = Math.min(max, Math.max(min, after));
    const first6m = Math.min(6, duration);
    const rest = Math.max(0, duration - 6);
    const total = first180 * first6m + after * rest;
    return { duration, first180, after, total, min, max, eligible };
  },
  ResultsPanel: ({ results: r }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Duración" value={`${r.duration} meses`} primary sub={r.eligible ? "Tienes derecho a la prestación" : "Necesitas mínimo 12 meses cotizados"} />
        <Metric label="Total estimado" value={eur(r.total)} />
        <Metric label="Primeros 6 meses" value={`${eur(r.first180)}/mes`} sub="70% base reguladora" />
        <Metric label="A partir del mes 7" value={`${eur(r.after)}/mes`} sub="60% base reguladora" />
      </div>
      <div className="rounded-lg border border-border p-4 text-sm">
        <p><strong>Topes 2026:</strong> mínimo {eur(r.min)}/mes, máximo {eur(r.max)}/mes (según número de hijos).</p>
      </div>
      <p className="text-xs text-muted-foreground">El paro tributa en IRPF como rendimiento del trabajo y SEPE practica retención. Fuente: <a className="underline" href="https://www.sepe.es/" target="_blank" rel="noopener">SEPE</a>.</p>
    </div>
  ),
  article: `## ¿Qué es la prestación por desempleo?\n\nEs la ayuda económica que recibes al perder tu empleo si has cotizado lo suficiente, regulada por el **Real Decreto Legislativo 8/2015 (LGSS)** y gestionada por el SEPE.\n\n## Requisitos 2026\n\n- Haber cotizado mínimo **12 meses** en los últimos 6 años\n- Estar en situación legal de desempleo (no haber dimitido voluntariamente)\n- Inscribirse como demandante de empleo en el SEPE\n\n## Cuantía\n\n- **Primeros 180 días**: 70% de la base reguladora\n- **A partir del día 181**: 60% de la base reguladora\n- Topes 2026: mín 80% IPREM (sin hijos) o 107% IPREM (con hijos); máx 175%-225% IPREM\n\n## Duración\n\n1 mes de paro por cada 3 cotizados, con máximo de **24 meses** (720 días con 6 años o más cotizados).`,
  faqs: [
    { question: "¿Cuánto cobraré de paro con un sueldo de 2.000 €?", answer: "Aproximadamente 1.400 €/mes los primeros 6 meses y 1.200 €/mes después, sujeto a topes." },
    { question: "¿Y si me despiden por causas objetivas?", answer: "Tienes derecho al paro y a indemnización de 20 días por año. No es necesario juicio." },
    { question: "¿Se puede compatibilizar con trabajo a tiempo parcial?", answer: "Sí, mediante la opción de compatibilidad: se reduce la prestación proporcionalmente." },
    { question: "¿Y si agoto el paro?", answer: "Puedes acceder al subsidio por desempleo (480 €/mes) o a la Renta Activa de Inserción (RAI)." },
    { question: "¿El paro tributa?", answer: "Sí, como rendimiento del trabajo. El SEPE retiene un % según tu situación." },
  ],
  related: ["calculadora-finiquito", "calculadora-ingreso-minimo-vital", "calculadora-ayudas-autonomos-nuevos"],
};