import type { CalculatorDef } from "./types";
import { eur, pct } from "../format";
import { Metric } from "../../components/Metric";
import { IPREM_ANNUAL_14 } from "../tax-spain";

interface R { coverage: number; grant: number; remaining: number; eligible: boolean }

export const rehabilitacionVivienda: CalculatorDef<R> = {
  slug: "calculadora-ayuda-rehabilitacion-vivienda",
  title: "Ayudas Rehabilitación de Vivienda 2026 (NextGenerationEU)",
  shortTitle: "Rehabilitación Vivienda",
  description: "Calcula la subvención por reformas energéticas: hasta el 65% del coste de obras de eficiencia.",
  longDescription: "Simulador de ayudas a la rehabilitación de vivienda 2026 (RD 853/2021, fondos NextGenerationEU).",
  category: "ayudas",
  icon: "Hammer",
  time: "2 min",
  difficulty: "Medio",
  fields: [
    { id: "works", label: "Tipo de obra", type: "select", defaultValue: "integral", options: [
      { value: "aislamiento", label: "Aislamiento térmico" },
      { value: "ventanas", label: "Sustitución de ventanas" },
      { value: "bomba", label: "Bomba de calor" },
      { value: "solar", label: "Placas solares" },
      { value: "integral", label: "Rehabilitación integral combinada" },
    ] },
    { id: "cost", label: "Coste estimado de la obra", type: "number", defaultValue: 20000, min: 0, max: 500000, step: 100, unit: "€" },
    { id: "income", label: "Ingresos anuales del hogar", type: "number", defaultValue: 28000, min: 0, max: 500000, step: 100, unit: "€" },
    { id: "saving", label: "Ahorro de energía primaria esperado", type: "select", defaultValue: "30", options: [
      { value: "30", label: "≥ 30% (mínimo)" },
      { value: "45", label: "≥ 45%" },
      { value: "60", label: "≥ 60%" },
    ] },
  ],
  calculate: (v) => {
    const eligible = +v.cost > 0;
    let coverage = v.saving === "60" ? 0.60 : v.saving === "45" ? 0.50 : 0.40;
    if (+v.income <= 2 * IPREM_ANNUAL_14) coverage += 0.15;
    coverage = Math.min(0.80, coverage);
    const grant = eligible ? +v.cost * coverage : 0;
    return { coverage, grant, remaining: +v.cost - grant, eligible };
  },
  ResultsPanel: ({ results: r }) => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Subvención estimada" value={eur(r.grant)} primary sub={`${pct(r.coverage)} del coste`} />
        <Metric label="Coste neto para ti" value={eur(r.remaining)} />
        <Metric label="Porcentaje cubierto" value={pct(r.coverage)} />
        <Metric label="Reducción mínima exigida" value="30% energía primaria" sub="Certificado energético" />
      </div>
      <p className="text-xs text-muted-foreground">Las ayudas se tramitan a través de tu comunidad autónoma o el IDAE. Es necesario un certificado energético antes y después. Fuente: <a className="underline" href="https://www.idae.es/" target="_blank" rel="noopener">IDAE</a> y <a className="underline" href="https://www.mivau.gob.es/" target="_blank" rel="noopener">MIVAU</a>.</p>
    </div>
  ),
  article: `## ¿Qué ayudas hay para rehabilitar tu vivienda en 2026?\n\nEl **Plan de Rehabilitación y Regeneración Urbana 2022-2026**, financiado con fondos europeos NextGenerationEU, ofrece subvenciones de hasta el **65% del coste** de obras que mejoren la eficiencia energética.\n\n## Programas disponibles\n\n- **Programa 3**: rehabilitación a nivel de edificio (mínimo 30% ahorro energético)\n- **Programa 4**: mejora de eficiencia en viviendas individuales\n- **Programa 5**: elaboración del libro del edificio existente\n- **PREE 5000** (municipios <5.000 hab.)\n\n## Obras subvencionables\n\nAislamiento térmico, sustitución de ventanas, sistemas de calefacción/refrigeración eficientes (aerotermia, biomasa), placas solares fotovoltaicas, puntos de recarga VE.\n\n## Cómo solicitarlo\n\nA través de la convocatoria de tu comunidad autónoma (las CCAA distribuyen los fondos del MIVAU). Se necesita certificado energético previo y posterior firmado por técnico.`,
  faqs: [
    { question: "¿Es compatible la ayuda con la deducción IRPF?", answer: "Sí, además de la subvención puedes aplicar deducciones del 20%, 40% o 60% en IRPF según el ahorro energético." },
    { question: "¿Cuánto tarda en cobrarse?", answer: "Habitualmente 6-12 meses tras la finalización de las obras y justificación de gastos." },
    { question: "¿Puede pedirla un inquilino?", answer: "No, la solicita el propietario o la comunidad de propietarios." },
    { question: "¿Hay tope por vivienda?", answer: "Sí, varía por programa: hasta 18.800 € por vivienda en Programa 4." },
    { question: "¿Y si vivo en una comunidad de vecinos?", answer: "La comunidad solicita la ayuda y se reparte entre propietarios según coeficiente." },
  ],
  related: ["calculadora-hipoteca", "calculadora-bono-social-electrico"],
};