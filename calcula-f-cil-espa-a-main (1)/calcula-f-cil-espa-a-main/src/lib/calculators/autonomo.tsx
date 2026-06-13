import type { CalculatorDef } from "./types";
import { eur, pct } from "../format";
import { Metric } from "../../components/Metric";
import { totalIrpf, retaQuota } from "../tax-spain";

interface R { gross: number; expenses: number; profit: number; reta: number; irpf: number; net: number; netMonthly: number; ivaRepercutido: number }

export const autonomo: CalculatorDef<R> = {
  slug: "calculadora-autonomo-2025",
  title: "Calculadora autónomo 2026: cuánto me queda al mes",
  shortTitle: "Autónomo 2026",
  description: "Calcula tu beneficio neto como autónomo después de IRPF, IVA y cuota RETA.",
  longDescription: "Simula tu nómina como autónomo: facturación, gastos, IVA, IRPF y cuota RETA.",
  category: "autonomo",
  icon: "Briefcase",
  time: "3 min",
  difficulty: "Medio",
  fields: [
    { id: "monthlyInvoicing", label: "Facturación mensual (sin IVA)", type: "number", defaultValue: 3000, min: 0, max: 100000, step: 50, unit: "€" },
    { id: "iva", label: "% IVA repercutido", type: "select", defaultValue: "21", options: [{ value: "21", label: "21% (general)" }, { value: "10", label: "10% (reducido)" }, { value: "4", label: "4% (superreducido)" }, { value: "0", label: "Exento" }] },
    { id: "monthlyExpenses", label: "Gastos deducibles mensuales", type: "number", defaultValue: 400, min: 0, max: 50000, step: 10, unit: "€" },
    { id: "regime", label: "Régimen fiscal", type: "select", defaultValue: "directa", options: [{ value: "directa", label: "Estimación directa" }, { value: "modulos", label: "Estimación objetiva (módulos)" }] },
  ],
  calculate: (v) => {
    const gross = +v.monthlyInvoicing * 12;
    const expenses = +v.monthlyExpenses * 12;
    const profit = Math.max(0, gross - expenses);
    // RETA quota according to monthly net profit
    const reta = retaQuota(Math.max(0, (profit) / 12 - 0)).quota * 12;
    const taxableBase = Math.max(0, profit - reta);
    const irpf = totalIrpf(taxableBase);
    const net = profit - reta - irpf;
    const ivaRepercutido = gross * (+v.iva / 100);
    return { gross, expenses, profit, reta, irpf, net, netMonthly: net / 12, ivaRepercutido };
  },
  ResultsPanel: ({ results }) => (
    <div className="grid grid-cols-2 gap-3">
      <Metric label="Te queda al mes" value={eur(results.netMonthly)} primary sub="después de impuestos y RETA" />
      <Metric label="Beneficio neto anual" value={eur(results.net)} />
      <Metric label="Cuota RETA anual" value={eur(results.reta)} sub={`${eur(results.reta / 12)}/mes`} />
      <Metric label="IRPF anual" value={eur(results.irpf)} sub={pct(results.gross > 0 ? results.irpf / results.gross : 0)} />
      <Metric label="Facturado bruto" value={eur(results.gross)} />
      <Metric label="IVA a ingresar (trim.)" value={eur(results.ivaRepercutido / 4)} sub="modelo 303" />
    </div>
  ),
  article: `## Cómo tributa un autónomo en España\n\nEl autónomo paga tres cosas principales: **IVA** (que repercute y luego ingresa), **IRPF** (sobre el beneficio neto) y la **cuota RETA** mensual a la Seguridad Social.\n\n## Estimación directa vs módulos\n\nLa **estimación directa** calcula el beneficio real: ingresos - gastos deducibles. Es la más habitual. Los **módulos** (estimación objetiva) se basan en parámetros fijos (m², empleados, consumo eléctrico) y solo aplican a ciertos sectores (hostelería, comercio, transporte).\n\n## Gastos deducibles típicos\n\nAlquiler local, suministros, material, vehículo (50% si uso mixto), formación, dietas, asesoría, software, marketing, cuota RETA, gastos financieros, amortizaciones.\n\n## IVA: el dinero que no es tuyo\n\nEl IVA que cobras a tus clientes **no es ingreso tuyo**. Lo ingresas a Hacienda cada trimestre (modelo 303) descontando el IVA soportado en tus gastos.`,
  faqs: [
    { question: "¿Cuánto se paga de cuota de autónomo en 2026?", answer: "Entre 200 € y 590 €/mes según rendimientos netos. Si eres nuevo autónomo, tarifa plana de 80 €/mes el primer año (prorrogable un segundo si ganas poco)." },
    { question: "¿Tarifa plana de autónomos 2026?", answer: "80 €/mes durante 12 meses para nuevos autónomos. Se prorroga 12 meses más si tus rendimientos netos no superan el SMI." },
    { question: "¿Qué gastos puedo deducir?", answer: "Los necesarios para tu actividad: local, suministros, vehículo profesional, formación, software, asesoría, herramientas, etc. Siempre con factura." },
    { question: "¿Cuándo presento IVA?", answer: "Trimestralmente (modelo 303): hasta el 20 de abril, julio, octubre y 30 de enero. Resumen anual modelo 390 en enero." },
    { question: "¿Y el IRPF como autónomo?", answer: "Pagos fraccionados trimestrales (modelo 130) del 20% del beneficio acumulado, y declaración anual con el resto." },
  ],
  related: ["calculadora-cuota-autonomo", "calculadora-irpf-2025"],
};