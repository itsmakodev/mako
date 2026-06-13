import type { CalculatorDef } from "./types";
import { eur } from "../format";
import { Metric } from "../../components/Metric";
import { IPREM_ANNUAL_14 } from "../tax-spain";

interface R { eligible: boolean; reason: string; monthly: number; annual: number; netRent: number; incomeLimit: number; margin: number }

const IPREM3 = IPREM_ANNUAL_14 * 3; // 25.200 €

export const bonoAlquilerJoven: CalculatorDef<R> = {
  slug: "calculadora-bono-alquiler-joven",
  title: "Calculadora Bono Alquiler Joven 2026: 250 € al mes",
  shortTitle: "Bono Alquiler Joven",
  description: "Comprueba si cumples los requisitos del Bono Alquiler Joven de 250 €/mes y calcula tu coste neto.",
  longDescription: "Simulador del Bono Alquiler Joven 2026 según el Plan Estatal de Vivienda 2022-2026 (RD 42/2022).",
  category: "ayudas",
  icon: "Home",
  time: "2 min",
  difficulty: "Fácil",
  fields: [
    { id: "age", label: "Edad", type: "number", defaultValue: 28, min: 16, max: 80, step: 1, unit: "años" },
    { id: "income", label: "Ingresos brutos anuales", type: "number", defaultValue: 18000, min: 0, max: 200000, step: 100, unit: "€" },
    { id: "rent", label: "Alquiler mensual", type: "number", defaultValue: 550, min: 0, max: 3000, step: 10, unit: "€" },
    { id: "type", label: "Tipo de alquiler", type: "select", defaultValue: "vivienda", options: [{ value: "vivienda", label: "Vivienda completa (máx 600 €)" }, { value: "habitacion", label: "Habitación (máx 300 €)" }] },
    { id: "family", label: "Situación familiar", type: "select", defaultValue: "estandar", options: [
      { value: "estandar", label: "Estándar (≤ 3× IPREM)" },
      { value: "numerosa", label: "Familia numerosa general (≤ 4× IPREM)" },
      { value: "especial", label: "Familia numerosa especial (≤ 5× IPREM)" },
      { value: "discapacidad", label: "Discapacidad (≤ 4× IPREM)" },
    ] },
  ],
  calculate: (v) => {
    const age = +v.age; const income = +v.income; const rent = +v.rent;
    const incomeLimit = v.family === "especial" ? IPREM3 * (5/3) : v.family === "numerosa" || v.family === "discapacidad" ? IPREM3 * (4/3) : IPREM3;
    const maxRent = v.type === "habitacion" ? 300 : 600;
    let eligible = true; let reason = "Cumples los requisitos principales.";
    if (age < 18 || age > 35) { eligible = false; reason = "La edad debe estar entre 18 y 35 años."; }
    else if (income > incomeLimit) { eligible = false; reason = `Tus ingresos superan el límite de ${eur(incomeLimit)}.`; }
    else if (rent > maxRent) { eligible = false; reason = `El alquiler supera el máximo permitido (${eur(maxRent)}/mes).`; }
    const monthly = eligible ? Math.min(250, rent * 0.5) : 0;
    return { eligible, reason, monthly, annual: monthly * 12, netRent: rent - monthly, incomeLimit, margin: incomeLimit - income };
  },
  ResultsPanel: ({ results: r }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Bono mensual" value={eur(r.monthly)} primary sub={r.eligible ? "Eres beneficiario" : "No cumples requisitos"} />
        <Metric label="Total ayuda anual" value={eur(r.annual)} />
        <Metric label="Alquiler neto tras ayuda" value={eur(r.netRent)} sub="Lo que pagas tú" />
        <Metric label="Margen sobre el límite" value={eur(Math.abs(r.margin))} sub={r.margin >= 0 ? "Por debajo del tope" : "Por encima del tope"} />
      </div>
      <div className={`p-4 rounded-lg ${r.eligible ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"} text-sm font-medium`}>{r.reason}</div>
      <p className="text-xs text-muted-foreground">El bono se solicita en tu comunidad autónoma; los plazos y trámites varían. Fuente: <a className="underline" href="https://www.mivau.gob.es/vivienda/alquiler/bono-alquiler-joven" target="_blank" rel="noopener">MIVAU</a>.</p>
    </div>
  ),
  article: `## ¿Qué es el Bono Alquiler Joven?\n\nEs una ayuda directa de **250 €/mes** durante 2 años para jóvenes de 18 a 35 años, regulada por el **Real Decreto 42/2022**. Forma parte del Plan Estatal para el Acceso a la Vivienda 2022-2026.\n\n## Requisitos 2026\n\n- Edad: 18-35 años\n- Contrato de alquiler en vigor a tu nombre\n- Ingresos ≤ 3× IPREM (25.200 €/año con 14 pagas)\n- Alquiler ≤ 600 €/mes (vivienda) o 300 €/mes (habitación)\n- No ser propietario de otra vivienda\n\n## Cómo solicitarlo\n\nLa gestión depende de cada comunidad autónoma. Suele requerirse contrato registrado, certificado de empadronamiento, IRPF y vida laboral.`,
  faqs: [
    { question: "¿Cuánto dura el Bono Alquiler Joven?", answer: "Se concede por 2 años, pudiendo solicitarse mientras se cumplan los requisitos y el programa esté en vigor." },
    { question: "¿Es compatible con el IMV?", answer: "Sí, ambos son compatibles porque atienden necesidades distintas." },
    { question: "¿Puede compartirse el alquiler?", answer: "Sí: cada inquilino joven puede solicitar 250 €/mes para su parte si cumple requisitos." },
    { question: "¿Y si cumplo 36 años durante la ayuda?", answer: "Mantienes la prestación hasta el fin del periodo concedido." },
    { question: "¿Qué pasa con el IRPF?", answer: "La ayuda se considera ganancia patrimonial pero está sujeta a las normas autonómicas de exención." },
  ],
  related: ["calculadora-ingreso-minimo-vital", "calculadora-hipoteca"],
};