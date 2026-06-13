import type { CalculatorDef } from "./types";
import { hipoteca } from "./hipoteca";
import { euribor } from "./euribor";
import { alquilerCompra } from "./alquiler-compra";
import { irpf2025 } from "./irpf-2025";
import { retencion } from "./retencion";
import { renta } from "./renta";
import { autonomo } from "./autonomo";
import { cuotaAutonomo } from "./cuota-autonomo";
import { finiquito } from "./finiquito";
import { pension } from "./pension";
import { baja } from "./baja-maternal";
import { interesCompuesto } from "./interes-compuesto";
import { imv } from "./imv";
import { bonoAlquilerJoven } from "./bono-alquiler-joven";
import { bonoSocial } from "./bono-social";
import { deduccionMaternidad } from "./deduccion-maternidad";
import { familiaNumerosa } from "./familia-numerosa";
import { desempleo } from "./desempleo";
import { rehabilitacionVivienda } from "./rehabilitacion-vivienda";
import { ayudasAutonomos } from "./ayudas-autonomos";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CALCULATORS: CalculatorDef<any>[] = [
  hipoteca, euribor, alquilerCompra,
  irpf2025, retencion, renta,
  autonomo, cuotaAutonomo,
  finiquito, pension, baja,
  interesCompuesto,
  imv, bonoAlquilerJoven, bonoSocial, deduccionMaternidad,
  familiaNumerosa, desempleo, rehabilitacionVivienda, ayudasAutonomos,
];

export const POPULAR_SLUGS = [
  "calculadora-hipoteca",
  "calculadora-irpf-2025",
  "calculadora-autonomo-2025",
  "calculadora-interes-compuesto",
  "calculadora-finiquito",
  "calculadora-cuota-autonomo",
];

export function getCalculator(slug: string) {
  return CALCULATORS.find((c) => c.slug === slug);
}