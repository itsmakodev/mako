import type { CalculatorDef } from "./types";
import { RETA_TRAMOS, retaQuota } from "../tax-spain";
import { eur } from "../format";
import { Metric } from "../../components/Metric";

interface R { tramo: typeof RETA_TRAMOS[number]; monthly: number; annual: number; userMonthlyIncome: number }

export const cuotaAutonomo: CalculatorDef<R> = {
  slug: "calculadora-cuota-autonomo",
  title: "Cuota de autónomo 2026: los 15 tramos del nuevo sistema",
  shortTitle: "Cuota RETA",
  description: "Calcula tu cuota mensual de autónomos según los 15 tramos por ingresos reales.",
  longDescription: "El nuevo sistema de cuotas RETA por ingresos reales aplicado en 2026, con los 15 tramos.",
  category: "autonomo",
  icon: "TrendingUp",
  time: "1 min",
  difficulty: "Fácil",
  fields: [
    { id: "annualNet", label: "Rendimientos netos anuales estimados", type: "number", defaultValue: 24000, min: 0, max: 1000000, step: 100, unit: "€" },
  ],
  calculate: (v) => {
    const monthly = +v.annualNet / 12;
    const tramo = retaQuota(monthly);
    return { tramo, monthly: tramo.quota, annual: tramo.quota * 12, userMonthlyIncome: monthly };
  },
  ResultsPanel: ({ results }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Tu cuota mensual" value={eur(results.monthly)} primary sub={results.tramo.label} />
        <Metric label="Coste anual" value={eur(results.annual)} />
      </div>
      <div>
        <h3 className="font-semibold mb-2 text-sm">Tabla completa de tramos RETA 2026</h3>
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-xs">
            <thead className="bg-muted"><tr><th className="p-2 text-left">Tramo</th><th className="p-2 text-right">Ingresos netos/mes</th><th className="p-2 text-right">Cuota</th></tr></thead>
            <tbody>{RETA_TRAMOS.map((t) => (
              <tr key={t.label} className={`border-t border-border ${t.label === results.tramo.label ? "bg-primary/10 font-semibold" : ""}`}>
                <td className="p-2">{t.label}</td>
                <td className="p-2 text-right">{t.min === 0 ? `< ${eur(t.max)}` : t.max === Infinity ? `> ${eur(t.min)}` : `${eur(t.min)} – ${eur(t.max)}`}</td>
                <td className="p-2 text-right">{eur(t.quota)}/mes</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  ),
  article: `## El nuevo sistema de cuotas por ingresos reales\n\nDesde 2023, la cuota de autónomos en España depende de los **rendimientos netos** que estimes obtener al año. Se divide en 15 tramos progresivos que van de 200 €/mes (para los que ganan poco) a 1.320 €/mes (más de 6.000 €/mes netos).\n\n## ¿Qué pasa si me equivoco al estimar?\n\nPuedes cambiar tu base de cotización **hasta 6 veces al año**. Al cierre del ejercicio, la Tesorería regulariza: si pagaste de menos, te lo reclama; si pagaste de más, te lo devuelve.\n\n## Tarifa plana para nuevos autónomos\n\nSi te das de alta por primera vez, puedes acogerte a la **tarifa plana de 80 €/mes** durante el primer año, prorrogable 12 meses más si tus ingresos no superan el SMI.\n\n## ¿Qué cubre la cuota?\n\nIncluye contingencias comunes y profesionales, cese de actividad (paro), formación y mejoras de la base.`,
  faqs: [
    { question: "¿Cuántas veces puedo cambiar mi tramo?", answer: "Hasta 6 veces al año, mediante el sistema Import@ss de la Seguridad Social." },
    { question: "¿La cuota es deducible?", answer: "Sí, la cuota RETA es 100% gasto deducible en tu IRPF y reduce tu beneficio neto." },
    { question: "¿Y si no facturo nada?", answer: "Aun así pagas como mínimo el tramo 1 (200 €/mes) salvo que tengas tarifa plana o bonificaciones." },
    { question: "¿Cuándo se paga la cuota?", answer: "El último día hábil de cada mes, mediante domiciliación bancaria obligatoria." },
    { question: "¿Hay bonificaciones?", answer: "Sí: tarifa plana, jóvenes <30 años, mujeres <35, víctimas de violencia de género, discapacitados, familiares colaboradores, pluriactividad..." },
  ],
  related: ["calculadora-autonomo-2025", "calculadora-irpf-2025"],
};