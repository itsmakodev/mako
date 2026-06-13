import type { CalculatorDef } from "./types";
import { eur } from "../format";
import { Metric } from "../../components/Metric";
import { IPREM_MONTHLY } from "../tax-spain";

interface R {
  monthly: number; annual: number; cap: number;
  baseAdult: number; extraAdults: number; childrenSupp: number;
  cumple: boolean; threshold: number; income: number; exento: number;
}

export const imv: CalculatorDef<R> = {
  slug: "calculadora-ingreso-minimo-vital",
  title: "Calculadora Ingreso Mínimo Vital 2026: requisitos y simulador",
  shortTitle: "Ingreso Mínimo Vital",
  description: "Comprueba si cumples los requisitos del IMV y estima la cuantía mensual que te corresponde en 2026.",
  longDescription: "Simulador del Ingreso Mínimo Vital según Real Decreto-ley 20/2020 con cuantías actualizadas 2026 e IPREM vigente.",
  category: "ayudas",
  icon: "HandHeart",
  time: "2 min",
  difficulty: "Fácil",
  fields: [
    { id: "adults", label: "Adultos en la unidad de convivencia", type: "number", defaultValue: 2, min: 1, max: 8, step: 1 },
    { id: "children", label: "Menores en la unidad", type: "number", defaultValue: 1, min: 0, max: 8, step: 1 },
    { id: "income", label: "Ingresos mensuales del hogar", type: "number", defaultValue: 600, min: 0, max: 10000, step: 10, unit: "€" },
    { id: "tenure", label: "Régimen de vivienda", type: "select", defaultValue: "alquiler", options: [{ value: "alquiler", label: "Alquiler" }, { value: "propiedad", label: "Propiedad" }] },
    { id: "disability", label: "Grado de discapacidad mayor adulto", type: "select", defaultValue: "0", options: [{ value: "0", label: "Sin discapacidad" }, { value: "33", label: "≥ 33%" }, { value: "65", label: "≥ 65%" }] },
  ],
  calculate: (v) => {
    const adults = +v.adults; const children = +v.children;
    const baseAdult = IPREM_MONTHLY * 0.8;                  // 480 €
    const extraAdults = Math.max(0, adults - 1) * IPREM_MONTHLY * 0.4; // 240 €
    const childrenSupp = Math.min(450, children * IPREM_MONTHLY * 0.2); // 120 € cap 450
    let monthly = baseAdult + extraAdults + childrenSupp;
    if (v.tenure === "alquiler") monthly *= 1.22; // complemento ayuda alquiler
    if (v.disability === "33") monthly *= 1.22;
    if (v.disability === "65") monthly *= 1.45;
    const cap = 1176 + children * 60;
    monthly = Math.min(monthly, cap);
    const threshold = monthly; // umbral garantizado
    const income = +v.income;
    const cumple = income < threshold;
    const benefit = cumple ? Math.max(0, threshold - income) : 0;
    const annual = benefit * 12;
    const exento = Math.min(annual, 12600);
    return { monthly: benefit, annual, cap, baseAdult, extraAdults, childrenSupp, cumple, threshold, income, exento };
  },
  ResultsPanel: ({ results: r }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="IMV mensual estimado" value={eur(r.monthly, 0)} primary sub={r.cumple ? "Probablemente cumples requisitos" : "Tus ingresos superan el umbral"} />
        <Metric label="Total anual" value={eur(r.annual)} sub={`Umbral garantizado ${eur(r.threshold)}/mes`} />
        <Metric label="Exento de IRPF" value={eur(r.exento)} sub="Hasta 1,5 × IPREM" />
        <Metric label="Tope máximo familiar" value={eur(r.cap)} />
      </div>
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="p-2 text-left">Concepto</th><th className="p-2 text-right">Importe</th></tr></thead>
          <tbody>
            <tr className="border-t border-border"><td className="p-2">Adulto principal (80% IPREM)</td><td className="p-2 text-right">{eur(r.baseAdult)}</td></tr>
            <tr className="border-t border-border"><td className="p-2">Adultos adicionales (40% IPREM c/u)</td><td className="p-2 text-right">{eur(r.extraAdults)}</td></tr>
            <tr className="border-t border-border"><td className="p-2">Menores (20% IPREM, máx 450 €)</td><td className="p-2 text-right">{eur(r.childrenSupp)}</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">Simulador orientativo. Cuantía real determinada por el INSS tras revisión patrimonial. Fuente: <a className="underline" href="https://www.seg-social.es/wps/portal/wss/internet/Trabajadores/PrestacionesPensionesTrabajadores/65850d68-8d06-4645-bde7-05374ee42ac7" target="_blank" rel="noopener">Seguridad Social</a>.</p>
    </div>
  ),
  article: `## ¿Qué es el Ingreso Mínimo Vital?\n\nEl IMV es una prestación no contributiva creada por el **Real Decreto-ley 20/2020** que garantiza un nivel mínimo de renta a hogares en situación de vulnerabilidad económica. Lo gestiona el INSS.\n\n## Requisitos 2026\n\n- Edad: 23-65 años (o mayor con hijos a cargo)\n- Residencia legal continuada en España de al menos 1 año\n- Ingresos del hogar por debajo de la renta garantizada\n- Patrimonio neto por debajo de 3× la renta garantizada anual\n\n## Cómo se calcula\n\nLa cuantía es la diferencia entre la **renta garantizada** (que depende del tamaño y composición del hogar) y los **ingresos computables**. La renta garantizada se calcula como 80% del IPREM para el primer adulto, +40% por cada adulto adicional y +20% por cada menor.\n\n## Cómo solicitarlo\n\nA través de la sede electrónica de la Seguridad Social, en oficinas del INSS con cita previa o por correo postal con el modelo oficial.`,
  faqs: [
    { question: "¿Cuánto se cobra de IMV con 2 hijos?", answer: "Una pareja con 2 hijos puede recibir hasta unos 1.000 €/mes si no tiene ingresos, según las cuantías 2026." },
    { question: "¿El IMV tributa en el IRPF?", answer: "Sí, pero está exento hasta 1,5 × IPREM (12.600 € en 2026). El exceso tributa como rendimiento del trabajo." },
    { question: "¿Es compatible con un trabajo?", answer: "Sí, el IMV es compatible con rentas del trabajo, con un sistema de incentivos al empleo." },
    { question: "¿Puedo cobrarlo si vivo de alquiler?", answer: "Sí, e incluso existe un complemento adicional para hogares en régimen de alquiler." },
    { question: "¿Cada cuánto se revisa la cuantía?", answer: "Anualmente, conforme se actualiza el IPREM en los Presupuestos Generales del Estado." },
  ],
  related: ["calculadora-bono-alquiler-joven", "calculadora-prestacion-desempleo", "calculadora-familia-numerosa"],
};