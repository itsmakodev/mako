import type { ComponentType } from "react";

export type FieldType = "number" | "select" | "date" | "range" | "radio";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string;
  unit?: string;
  tooltip?: string;
  options?: FieldOption[];
  width?: "full" | "half";
}

export type Values = Record<string, number | string>;

export interface FAQ {
  question: string;
  answer: string;
}

export interface CalculatorDef<TResults = unknown> {
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  longDescription: string;
  category: CategoryKey;
  icon: string; // lucide name
  time: string; // "2 min"
  difficulty: "Fácil" | "Medio" | "Avanzado";
  fields: FieldDef[];
  calculate: (values: Values) => TResults;
  ResultsPanel: ComponentType<{ results: TResults; values: Values }>;
  article: string; // markdown-lite
  faqs: FAQ[];
  related?: string[]; // slugs
}

export type CategoryKey =
  | "hipoteca"
  | "irpf"
  | "autonomo"
  | "laboral"
  | "inversion"
  | "ayudas"
  | "otros";

export interface Category {
  key: CategoryKey;
  label: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { key: "hipoteca", label: "Hipoteca y vivienda", icon: "Home", color: "from-blue-500 to-indigo-600" },
  { key: "irpf", label: "IRPF y fiscalidad", icon: "Receipt", color: "from-emerald-500 to-teal-600" },
  { key: "autonomo", label: "Autónomos", icon: "Briefcase", color: "from-amber-500 to-orange-600" },
  { key: "laboral", label: "Laboral", icon: "Users", color: "from-rose-500 to-pink-600" },
  { key: "inversion", label: "Inversión", icon: "TrendingUp", color: "from-violet-500 to-purple-600" },
  { key: "ayudas", label: "Ayudas y subvenciones", icon: "HandHeart", color: "from-sky-500 to-cyan-600" },
  { key: "otros", label: "Otros", icon: "Calculator", color: "from-slate-500 to-slate-700" },
];