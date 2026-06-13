import type { CalculatorDef } from "./types";
import { eur, pct } from "../format";
import { Metric } from "../../components/Metric";

interface R { discount: number; monthlySaving: number; annualSaving: number; newBill: number; eligible: boolean }

export const bonoSocial: CalculatorDef<R> = {
  slug: "calculadora-bono-social-electrico",
  title: "Calculadora Bono Social Eléctrico 2026: descuento en la factura",
  shortTitle: "Bono Social",
  description: "Calcula tu descuento en la factura de la luz con el Bono Social: 25%, 40% u 80% según vulnerabilidad.",
  longDescription: "Simulador del Bono Social Eléctrico 2026 (Real Decreto 897/2017 actualizado).",
  category: "ayudas",
  icon: "Zap",
  time: "1 min",
  difficulty: "Fácil",
  fields: [
    { id: "bill", label: "Factura mensual de luz actual", type: "number", defaultValue: 80, min: 0, max: 1000, step: 1, unit: "€" },
    { id: "level", label: "Nivel de vulnerabilidad", type: "select", defaultValue: "vulnerable", options: [
      { value: "ninguno", label: "Sin reconocimiento" },
      { value: "vulnerable", label: "Consumidor vulnerable (25%)" },
      { value: "severo", label: "Vulnerable severo (40%)" },
      { value: "exclusion", label: "Riesgo de exclusión social (80%)" },
    ] },
    { id: "income", label: "Ingresos brutos anuales del hogar", type: "number", defaultValue: 15000, min: 0, max: 200000, step: 100, unit: "€" },
    { id: "members", label: "Personas en la unidad familiar", type: "number", defaultValue: 3, min: 1, max: 10, step: 1 },
  ],
  calculate: (v) => {
    const discount = v.level === "vulnerable" ? 0.25 : v.level === "severo" ? 0.40 : v.level === "exclusion" ? 0.80 : 0;
    const bill = +v.bill;
    const monthlySaving = bill * discount;
    return { discount, monthlySaving, annualSaving: monthlySaving * 12, newBill: bill - monthlySaving, eligible: discount > 0 };
  },
  ResultsPanel: ({ results: r }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Descuento aplicado" value={pct(r.discount)} primary />
        <Metric label="Ahorro mensual" value={eur(r.monthlySaving)} />
        <Metric label="Nueva factura" value={eur(r.newBill)} sub="Tras descuento" />
        <Metric label="Ahorro anual" value={eur(r.annualSaving)} />
      </div>
      <p className="text-xs text-muted-foreground">El Bono Social se aplica solo sobre el PVPC (tarifa regulada). Fuente: <a className="underline" href="https://www.bonosocial.gob.es/" target="_blank" rel="noopener">bonosocial.gob.es</a>.</p>
    </div>
  ),
  article: `## ¿Qué es el Bono Social Eléctrico?\n\nEs un descuento directo en la factura de la luz para hogares vulnerables, regulado por el **Real Decreto 897/2017** y sus actualizaciones. Solo se aplica si tienes contratada la tarifa **PVPC** con una comercializadora de referencia.\n\n## Niveles de descuento 2026\n\n- **Vulnerable**: 25%\n- **Vulnerable severo**: 40%\n- **Riesgo de exclusión social**: 80% (acreditado por servicios sociales)\n\n## Requisitos\n\nDependen de los ingresos del hogar en relación con el IPREM, ajustados por el número de miembros y circunstancias (familia numerosa, monoparental, pensionista, discapacidad).\n\n## Cómo solicitarlo\n\nA través de tu Comercializadora de Referencia (Endesa, Iberdrola, Naturgy COR, etc.) con el modelo de solicitud oficial, IRPF y certificado de empadronamiento.`,
  faqs: [
    { question: "¿Quién puede pedir el Bono Social?", answer: "Hogares con ingresos por debajo de 1,5-2× IPREM (ajustado por miembros y circunstancias)." },
    { question: "¿Cuánto dura?", answer: "2 años, renovable si se siguen cumpliendo requisitos." },
    { question: "¿Es compatible con otras ayudas?", answer: "Sí, con el IMV, ayudas autonómicas y bono térmico." },
    { question: "¿Y el bono térmico?", answer: "Es una ayuda anual adicional automática para beneficiarios del Bono Social Eléctrico (calefacción y agua caliente)." },
    { question: "¿Hay límite de consumo?", answer: "Sí, el descuento se aplica hasta un consumo máximo anual definido por tipología de hogar." },
  ],
  related: ["calculadora-ingreso-minimo-vital", "calculadora-familia-numerosa"],
};