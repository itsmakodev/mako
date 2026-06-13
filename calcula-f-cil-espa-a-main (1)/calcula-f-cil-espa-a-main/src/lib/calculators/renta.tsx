import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import type { CalculatorDef } from "./types";
import { eur } from "../format";
import { Metric } from "../../components/Metric";
import { totalIrpf } from "../tax-spain";

interface R { totalIncome: number; deductions: number; tax: number; withheld: number; result: number; chart: { name: string; value: number }[] }

export const renta: CalculatorDef<R> = {
  slug: "calculadora-declaracion-renta",
  title: "Simulador declaración de la renta 2025",
  shortTitle: "Declaración Renta",
  description: "Simula si tu declaración de la renta sale a pagar o a devolver.",
  longDescription: "Simulador simplificado de IRPF con todas las fuentes de ingreso y deducciones más comunes.",
  category: "irpf",
  icon: "ClipboardCheck",
  time: "4 min",
  difficulty: "Medio",
  fields: [
    { id: "salary", label: "Rendimientos del trabajo", type: "number", defaultValue: 28000, min: 0, max: 1000000, step: 100, unit: "€" },
    { id: "withheld", label: "IRPF ya retenido", type: "number", defaultValue: 3500, min: 0, max: 500000, step: 100, unit: "€" },
    { id: "rental", label: "Rendimientos alquiler (neto)", type: "number", defaultValue: 0, min: 0, max: 500000, step: 100, unit: "€" },
    { id: "dividends", label: "Dividendos / intereses", type: "number", defaultValue: 0, min: 0, max: 500000, step: 100, unit: "€" },
    { id: "capitalGains", label: "Ganancias patrimoniales", type: "number", defaultValue: 0, min: 0, max: 5000000, step: 100, unit: "€" },
    { id: "pension", label: "Aportación plan de pensiones", type: "number", defaultValue: 0, min: 0, max: 1500, step: 100, unit: "€" },
    { id: "donations", label: "Donativos a ONG", type: "number", defaultValue: 0, min: 0, max: 100000, step: 10, unit: "€" },
  ],
  calculate: (v) => {
    const salary = +v.salary; const rental = +v.rental;
    const generalBase = salary - 2000 + rental - Math.min(+v.pension, 1500);
    const generalTax = totalIrpf(Math.max(0, generalBase));
    const savingsBase = +v.dividends + +v.capitalGains;
    const savingsTax = savingsBase * (savingsBase <= 6000 ? 0.19 : savingsBase <= 50000 ? 0.21 : savingsBase <= 200000 ? 0.23 : savingsBase <= 300000 ? 0.27 : 0.28);
    const donationsDeduction = Math.min(+v.donations, 150) * 0.8 + Math.max(0, +v.donations - 150) * 0.4;
    const tax = Math.max(0, generalTax + savingsTax - donationsDeduction);
    const withheld = +v.withheld;
    const result = withheld - tax;
    return {
      totalIncome: salary + rental + savingsBase,
      deductions: (+v.pension) + donationsDeduction,
      tax, withheld, result,
      chart: [
        { name: "Ingresos", value: salary + rental + savingsBase },
        { name: "Cuota IRPF", value: tax },
        { name: "Retenciones", value: withheld },
        { name: result >= 0 ? "A devolver" : "A pagar", value: Math.abs(result) },
      ],
    };
  },
  ResultsPanel: ({ results }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label={results.result >= 0 ? "A devolver" : "A pagar"} value={eur(Math.abs(results.result))} primary sub={results.result >= 0 ? "Hacienda te devuelve" : "Pagarás a Hacienda"} />
        <Metric label="Cuota IRPF" value={eur(results.tax)} />
        <Metric label="Ya retenido" value={eur(results.withheld)} />
        <Metric label="Ingresos totales" value={eur(results.totalIncome)} />
      </div>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={results.chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => eur(v)} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  ),
  article: `## Cómo funciona la declaración de la renta\n\nEl ejercicio fiscal en España va del 1 de enero al 31 de diciembre. Entre abril y junio del año siguiente debes presentar tu **declaración del IRPF** (Modelo 100) en la AEAT.\n\n## Bases del impuesto\n\nEl IRPF tiene dos bases que tributan por separado:\n\n1. **Base general**: trabajo, alquileres, actividades económicas. Se aplica la escala progresiva (9,5% al 47%).\n2. **Base del ahorro**: dividendos, intereses, ganancias patrimoniales. Tipos del 19% al 28%.\n\n## Deducciones más comunes\n\n- Plan de pensiones: hasta 1.500 €/año (reduce base imponible).\n- Donativos: 80% de los primeros 150 €, 40% del resto.\n- Hipoteca vivienda habitual anterior a 2013: 15% hasta 9.040 €.\n- Maternidad: hasta 1.200 €/año por hijo menor de 3 años.\n- Por familia numerosa, discapacidad...`,
  faqs: [
    { question: "¿Estoy obligado a hacer la declaración?", answer: "Sí si ingresas más de 22.000 € de un pagador, o más de 15.876 € con varios pagadores. También si tienes rendimientos del ahorro >1.600 € o autónomo." },
    { question: "¿Qué plazos hay en 2026?", answer: "Generalmente desde principios de abril hasta el 30 de junio. Si sale a pagar y domicilias, hasta el 25 de junio." },
    { question: "¿Qué documentos necesito?", answer: "Certificado retribuciones empresa, certificados bancarios, justificantes alquileres, donativos, plan pensiones, hipoteca." },
    { question: "¿Conviene revisar el borrador?", answer: "Sí, siempre. Hacienda no incluye deducciones autonómicas, donativos no comunicados, ni todos los gastos deducibles de alquiler." },
    { question: "¿Qué pasa si me equivoco?", answer: "Puedes presentar declaración complementaria (si fue a tu favor) o solicitud de rectificación (si fue contra ti). Sin sanción si lo haces voluntariamente." },
  ],
  related: ["calculadora-irpf-2025", "calculadora-retencion-irpf"],
};