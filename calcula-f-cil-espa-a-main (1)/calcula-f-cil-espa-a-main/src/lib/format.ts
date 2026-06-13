export const eur = (n: number, digits = 0) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(isFinite(n) ? n : 0);

export const pct = (n: number, digits = 2) =>
  new Intl.NumberFormat("es-ES", {
    style: "percent",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(isFinite(n) ? n : 0);

export const num = (n: number, digits = 0) =>
  new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(isFinite(n) ? n : 0);