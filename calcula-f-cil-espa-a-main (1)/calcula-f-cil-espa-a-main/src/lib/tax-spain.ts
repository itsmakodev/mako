// Spain 2026 tax data — used across calculators

export const IRPF_STATE_BRACKETS: { upTo: number; rate: number }[] = [
  { upTo: 12450, rate: 0.095 },
  { upTo: 20200, rate: 0.12 },
  { upTo: 35200, rate: 0.15 },
  { upTo: 60000, rate: 0.185 },
  { upTo: 300000, rate: 0.225 },
  { upTo: Infinity, rate: 0.245 },
];

// Comunidad de Madrid as default autonomous community
export const IRPF_MADRID_BRACKETS: { upTo: number; rate: number }[] = [
  { upTo: 13362.22, rate: 0.085 },
  { upTo: 19004.63, rate: 0.107 },
  { upTo: 35425.68, rate: 0.128 },
  { upTo: 57320.4, rate: 0.174 },
  { upTo: Infinity, rate: 0.205 },
];

export const COMUNIDADES = [
  "Andalucía",
  "Aragón",
  "Asturias",
  "Baleares",
  "Canarias",
  "Cantabria",
  "Castilla-La Mancha",
  "Castilla y León",
  "Cataluña",
  "Comunidad Valenciana",
  "Extremadura",
  "Galicia",
  "La Rioja",
  "Madrid",
  "Murcia",
  "Navarra",
  "País Vasco",
] as const;

// Employee Social Security contributions 2026
export const SS_EMPLOYEE_RATE = 0.0635; // 4.70 + 1.55 + 0.10

// IPREM 2026 (Indicador Público de Renta de Efectos Múltiples)
export const IPREM_MONTHLY = 600;          // €/mes
export const IPREM_ANNUAL_12 = 7200;       // €/año (12 pagas)
export const IPREM_ANNUAL_14 = 8400;       // €/año (14 pagas)

// SMI 2026
export const SMI_MONTHLY = 1184;           // €/mes (14 pagas)
export const SMI_ANNUAL = 16576;           // €/año

// RETA tarifa plana
export const TARIFA_PLANA = 80;            // €/mes nuevos autónomos

// Personal minimum (mínimo personal y familiar) — simplified
export const MINIMO_PERSONAL = 5550;
export const MINIMO_HIJO = [2400, 2700, 4000, 4500]; // por 1º, 2º, 3º, 4º+ hijo
export const MINIMO_DISCAPACIDAD = 3000; // 33-65%

export function progressiveTax(
  base: number,
  brackets: { upTo: number; rate: number }[],
): number {
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (base <= prev) break;
    const slice = Math.min(base, b.upTo) - prev;
    tax += slice * b.rate;
    prev = b.upTo;
  }
  return tax;
}

export function totalIrpf(base: number): number {
  return (
    progressiveTax(base, IRPF_STATE_BRACKETS) +
    progressiveTax(base, IRPF_MADRID_BRACKETS)
  );
}

export function marginalRate(base: number): number {
  let stateRate = 0;
  for (const b of IRPF_STATE_BRACKETS) {
    if (base <= b.upTo) {
      stateRate = b.rate;
      break;
    }
  }
  let autoRate = 0;
  for (const b of IRPF_MADRID_BRACKETS) {
    if (base <= b.upTo) {
      autoRate = b.rate;
      break;
    }
  }
  return stateRate + autoRate;
}

// RETA 2026 — 15 tramos
export const RETA_TRAMOS: { min: number; max: number; quota: number; label: string }[] = [
  { min: 0, max: 670, quota: 200, label: "Tramo 1" },
  { min: 670, max: 900, quota: 220, label: "Tramo 2" },
  { min: 900, max: 1166.7, quota: 260, label: "Tramo 3" },
  { min: 1166.7, max: 1300, quota: 310, label: "Tramo 4" },
  { min: 1300, max: 1500, quota: 350, label: "Tramo 5" },
  { min: 1500, max: 1700, quota: 370, label: "Tramo 6" },
  { min: 1700, max: 1850, quota: 390, label: "Tramo 7" },
  { min: 1850, max: 2030, quota: 420, label: "Tramo 8" },
  { min: 2030, max: 2330, quota: 460, label: "Tramo 9" },
  { min: 2330, max: 2760, quota: 490, label: "Tramo 10" },
  { min: 2760, max: 3190, quota: 530, label: "Tramo 11" },
  { min: 3190, max: 3620, quota: 590, label: "Tramo 12" },
  { min: 3620, max: 4050, quota: 650, label: "Tramo 13" },
  { min: 4050, max: 6000, quota: 720, label: "Tramo 14" },
  { min: 6000, max: Infinity, quota: 1320, label: "Tramo 15" },
];

export function retaQuota(monthlyNet: number) {
  return RETA_TRAMOS.find((t) => monthlyNet >= t.min && monthlyNet < t.max) ?? RETA_TRAMOS[14];
}