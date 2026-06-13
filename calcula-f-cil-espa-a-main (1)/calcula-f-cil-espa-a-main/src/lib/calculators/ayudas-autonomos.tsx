import type { CalculatorDef } from "./types";
import { eur } from "../format";
import { Metric } from "../../components/Metric";
import { TARIFA_PLANA, SMI_MONTHLY } from "../tax-spain";

interface R { savingYear1: number; savingYear2: number; pagoUnico: number; total: number; bonifJoven: number; eligibleY2: boolean }

const RETA_STANDARD = 310; // cuota media tramo medio

export const ayudasAutonomos: CalculatorDef<R> = {
  slug: "calculadora-ayudas-autonomos-nuevos",
  title: "Ayudas para Nuevos Autónomos 2026: tarifa plana y pago único",
  shortTitle: "Ayudas Autónomos",
  description: "Calcula tu ahorro con la tarifa plana de 80 €/mes, el pago único del paro y bonificaciones para jóvenes.",
  longDescription: "Simulador de las principales ayudas para autónomos que se dan de alta por primera vez en 2026.",
  category: "ayudas",
  icon: "Briefcase",
  time: "2 min",
  difficulty: "Medio",
  fields: [
    { id: "age", label: "Edad", type: "number", defaultValue: 32, min: 16, max: 80, step: 1, unit: "años" },
    { id: "gender", label: "Género", type: "select", defaultValue: "h", options: [{ value: "h", label: "Hombre" }, { value: "m", label: "Mujer" }] },
    { id: "paroLeft", label: "Meses de paro pendientes", type: "number", defaultValue: 12, min: 0, max: 24, step: 1 },
    { id: "paroAmount", label: "Cuantía mensual del paro", type: "number", defaultValue: 1100, min: 0, max: 3000, step: 10, unit: "€" },
    { id: "netMonthly", label: "Ingresos netos mensuales esperados", type: "number", defaultValue: 1000, min: 0, max: 10000, step: 10, unit: "€" },
  ],
  calculate: (v) => {
    const savingYear1 = (RETA_STANDARD - TARIFA_PLANA) * 12;
    const eligibleY2 = +v.netMonthly < SMI_MONTHLY;
    const savingYear2 = eligibleY2 ? (RETA_STANDARD - TARIFA_PLANA) * 12 : 0;
    const ageLimit = v.gender === "m" ? 35 : 30;
    const bonifJoven = +v.age < ageLimit ? RETA_STANDARD * 0.30 * 36 : 0;
    const pagoUnico = +v.paroLeft * +v.paroAmount;
    return { savingYear1, savingYear2, pagoUnico, total: savingYear1 + savingYear2 + bonifJoven + pagoUnico, bonifJoven, eligibleY2 };
  },
  ResultsPanel: ({ results: r }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Ahorro tarifa plana año 1" value={eur(r.savingYear1)} primary sub="80 €/mes vs cuota estándar" />
        <Metric label="Ahorro tarifa plana año 2" value={eur(r.savingYear2)} sub={r.eligibleY2 ? "Cumples (ingresos < SMI)" : "No cumples requisito de ingresos"} />
        <Metric label="Pago único del paro" value={eur(r.pagoUnico)} sub="Capitalización 100% paro restante" />
        <Metric label="Bonificación jóvenes" value={eur(r.bonifJoven)} sub="30% RETA durante 36 meses" />
      </div>
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm">
        <p className="font-semibold text-foreground">Ahorro total potencial:</p>
        <p className="text-2xl font-bold text-primary tracking-tight mt-1">{eur(r.total)}</p>
      </div>
      <p className="text-xs text-muted-foreground">Tarifa plana regulada por la <a className="underline" href="https://www.boe.es/buscar/act.php?id=BOE-A-2017-12207" target="_blank" rel="noopener">Ley 6/2017</a>. Pago único gestionado por el SEPE.</p>
    </div>
  ),
  article: `## Ayudas para nuevos autónomos en 2026\n\nDarse de alta como autónomo es más fácil gracias a varias ayudas estatales: tarifa plana, capitalización del paro y bonificaciones para colectivos específicos.\n\n## Tarifa plana de 80 €/mes\n\nDurante los **primeros 12 meses** de alta en el RETA, pagas solo 80 €/mes (en lugar de los 230-1.300 € del régimen general). Se puede **prorrogar 12 meses más** si tus rendimientos netos están por debajo del SMI.\n\n## Pago único del paro\n\nPuedes solicitar el **100% del paro restante** en un único pago para invertirlo en iniciar la actividad (compra de bienes, alta, gastos iniciales). Se pide al SEPE antes de darte de alta.\n\n## Bonificaciones jóvenes\n\n- Hombres < 30 años: **30% de reducción** adicional sobre la cuota durante 36 meses tras la tarifa plana\n- Mujeres < 35 años: misma bonificación\n- Personas con discapacidad ≥ 33%: tarifa plana extendida a 24 meses\n- Familiares colaboradores y víctimas de violencia de género: bonificaciones específicas\n\n## Cómo solicitarlo\n\nAlta en Hacienda (modelo 036/037), alta en RETA (Tesorería General de la Seguridad Social) y, en su caso, solicitud previa de pago único al SEPE.`,
  faqs: [
    { question: "¿Cuánto puedo ahorrar con la tarifa plana?", answer: "Más de 2.700 € en el primer año respecto a la cuota mínima estándar, y otros 2.700 € si te prorroga el segundo año." },
    { question: "¿El pago único tributa?", answer: "Está exento de IRPF si lo destinas íntegramente a la actividad y mantienes el alta 5 años." },
    { question: "¿Puedo pedir la tarifa plana si ya fui autónomo antes?", answer: "Solo si han pasado al menos 3 años desde la última baja (2 si ya disfrutaste tarifa plana)." },
    { question: "¿Es compatible con paro parcial?", answer: "No: si optas por la capitalización en pago único, renuncias al cobro mensual restante." },
    { question: "¿Y si soy mujer menor de 35?", answer: "Tienes derecho a una bonificación adicional del 30% sobre la cuota durante 36 meses tras la tarifa plana." },
  ],
  related: ["calculadora-cuota-autonomo", "calculadora-autonomo-2025", "calculadora-prestacion-desempleo"],
};