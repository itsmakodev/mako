import type { CalculatorDef } from "./types";
import { eur } from "../format";
import { Metric } from "../../components/Metric";

interface R { annualDeduction: number; monthlyAdvance: number; extra: number; total: number }

export const familiaNumerosa: CalculatorDef<R> = {
  slug: "calculadora-familia-numerosa",
  title: "Calculadora Familia Numerosa 2026: deducciones y ayudas",
  shortTitle: "Familia Numerosa",
  description: "Calcula la deducción IRPF por familia numerosa (1.200 € o 2.400 €) y el adelanto mensual.",
  longDescription: "Simulador de la deducción IRPF por familia numerosa (Art. 81 bis LIRPF) y beneficios asociados en 2026.",
  category: "ayudas",
  icon: "Users",
  time: "1 min",
  difficulty: "Fácil",
  fields: [
    { id: "children", label: "Número total de hijos", type: "number", defaultValue: 3, min: 2, max: 12, step: 1 },
    { id: "category", label: "Categoría", type: "select", defaultValue: "general", options: [
      { value: "general", label: "General (3 hijos o 2 con discapacidad)" },
      { value: "especial", label: "Especial (5 o más hijos)" },
    ] },
    { id: "disability", label: "Algún hijo con discapacidad reconocida", type: "select", defaultValue: "no", options: [{ value: "no", label: "No" }, { value: "si", label: "Sí" }] },
    { id: "income", label: "Ingresos brutos anuales del hogar", type: "number", defaultValue: 35000, min: 0, max: 500000, step: 100, unit: "€" },
  ],
  calculate: (v) => {
    const base = v.category === "especial" ? 2400 : 1200;
    const minChildren = v.category === "especial" ? 5 : 3;
    const extra = Math.max(0, +v.children - minChildren) * 600;
    const disab = v.disability === "si" ? 1200 : 0;
    const annualDeduction = base + extra + disab;
    return { annualDeduction, monthlyAdvance: annualDeduction / 12, extra, total: annualDeduction };
  },
  ResultsPanel: ({ results: r }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Deducción IRPF anual" value={eur(r.annualDeduction)} primary />
        <Metric label="Adelanto mensual" value={eur(r.monthlyAdvance)} sub="Modelo 143" />
        <Metric label="Por hijos adicionales" value={eur(r.extra)} />
        <Metric label="Total ayuda anual" value={eur(r.total)} />
      </div>
      <div className="rounded-lg border border-border p-4 text-sm space-y-1">
        <p className="font-semibold">Ventajas adicionales del título de familia numerosa:</p>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>Bonificaciones en transporte público, museos y educación.</li>
          <li>Reducciones en IBI y plusvalías municipales (según ayuntamiento).</li>
          <li>Acceso preferente a Bono Alquiler Joven con límite ampliado.</li>
          <li>Compatible con IMV y deducción por maternidad.</li>
        </ul>
      </div>
      <p className="text-xs text-muted-foreground">Fuente: <a className="underline" href="https://www.boe.es/buscar/act.php?id=BOE-A-2003-21052" target="_blank" rel="noopener">Ley 40/2003</a> y AEAT.</p>
    </div>
  ),
  article: `## ¿Qué es la familia numerosa?\n\nSe considera familia numerosa la formada por uno o dos ascendientes con **3 o más hijos** (o 2 si uno tiene discapacidad), según la **Ley 40/2003**. El título lo expide la comunidad autónoma.\n\n## Deducción IRPF (Art. 81 bis)\n\n- General: **1.200 €/año**\n- Especial: **2.400 €/año**\n- +600 €/año por cada hijo adicional sobre el mínimo de la categoría\n\n## Modalidades de cobro\n\nSe puede cobrar como adelanto mensual (modelo 143) o aplicar en la declaración anual del IRPF.`,
  faqs: [
    { question: "¿Cuándo paso a categoría especial?", answer: "Con 5 o más hijos, o 4 si al menos 3 proceden de parto, adopción o acogimiento múltiples." },
    { question: "¿Se mantiene si los hijos cumplen 18?", answer: "Sí, mientras dependan económicamente y cursen estudios hasta los 21 (25 con estudios reglados)." },
    { question: "¿Es compatible con maternidad y MIV?", answer: "Sí, todas son compatibles entre sí." },
    { question: "¿Hay límite de renta?", answer: "Para la deducción IRPF no, pero sí está limitada a las cotizaciones a la Seguridad Social del contribuyente." },
    { question: "¿Familias monoparentales?", answer: "Cuentan como numerosas con 2 hijos a partir de la reforma de 2021 (Comunidad de Madrid y otras CCAA)." },
  ],
  related: ["calculadora-deduccion-maternidad", "calculadora-ingreso-minimo-vital", "calculadora-irpf-2025"],
};