import type { CalculatorDef } from "./types";
import { irpf2025 } from "./irpf-2025";
import { eur, pct } from "../format";
import { Metric } from "../../components/Metric";

interface R { retention: number; monthly: number; annual: number }

export const retencion: CalculatorDef<R> = {
  slug: "calculadora-retencion-irpf",
  title: "Calculadora de retención IRPF en nómina",
  shortTitle: "Retención IRPF",
  description: "Estima el % de IRPF que tu empresa debe retener cada mes en tu nómina.",
  longDescription: "Calcula la retención de IRPF correcta para tu nómina según tus circunstancias personales.",
  category: "irpf",
  icon: "FileText",
  time: "2 min",
  difficulty: "Fácil",
  fields: irpf2025.fields,
  calculate: (v) => {
    const base = irpf2025.calculate(v);
    return { retention: base.effective, monthly: base.irpf / 12, annual: base.irpf };
  },
  ResultsPanel: ({ results }) => (
    <div className="grid grid-cols-2 gap-3">
      <Metric label="% retención IRPF" value={pct(results.retention)} primary />
      <Metric label="Retención mensual" value={eur(results.monthly)} />
      <Metric label="Retención anual" value={eur(results.annual)} />
    </div>
  ),
  article: `## ¿Cómo calcula Hacienda mi retención?\n\nTu empresa retiene un porcentaje de tu salario bruto cada mes para anticipar el IRPF que tendrás que pagar al hacer la declaración. El porcentaje depende de tu salario anual estimado y de tu situación personal (estado civil, hijos, discapacidad...).\n\n## Modelo 145\n\nEl famoso **Modelo 145** es el formulario que rellenas en tu empresa para que ajusten correctamente tu retención. Cualquier cambio en tu situación (boda, hijo, divorcio) requiere actualizarlo.\n\n## ¿Por qué a veces sale a pagar en la Renta?\n\nSi la retención fue menor de lo que correspondía (por cambio de trabajo, dos pagadores, etc.), Hacienda te lo reclama en la declaración. Si fue mayor, te lo devuelve.`,
  faqs: [
    { question: "¿Puedo pedir que me retengan más?", answer: "Sí, en tu empresa puedes solicitar voluntariamente una retención superior a la mínima legal." },
    { question: "Tengo dos pagadores, ¿qué pasa?", answer: "Si el segundo pagador supera 1.500 €/año, estás obligado a declarar siempre que la suma supere los 15.876 €. Conviene aumentar voluntariamente la retención." },
    { question: "¿Cuándo se actualiza la retención?", answer: "Cada vez que cambian tus circunstancias (boda, hijo...) o anualmente al revisar tu salario." },
    { question: "¿La retención mínima es del 2%?", answer: "Para contratos temporales de menos de un año, sí. Para indefinidos no hay mínimo fijo, depende del cálculo." },
    { question: "¿Las dietas se incluyen en el cálculo?", answer: "Las dietas exentas (hasta 26,67 €/día nacional, 48,08 € extranjero) no, el resto sí." },
  ],
  related: ["calculadora-irpf-2025", "calculadora-declaracion-renta"],
};