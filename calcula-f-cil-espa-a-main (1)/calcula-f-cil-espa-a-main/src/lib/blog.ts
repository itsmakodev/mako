export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  category: string;
  content: string; // markdown-lite (H2 ## and paragraphs)
}

export const POSTS: Post[] = [
  {
    slug: "como-tributa-criptomonedas-2025",
    title: "Cómo tributan las criptomonedas en España en 2026",
    excerpt: "Todo lo que tienes que saber para declarar Bitcoin, Ethereum y otros criptoactivos en la Renta sin sustos.",
    date: "2026-03-12",
    readMinutes: 8,
    category: "Fiscalidad",
    content: `## Las criptos también van a la Renta\n\nDesde 2021, la AEAT vigila de cerca a los inversores en criptomonedas. Vender, intercambiar o usar cripto para pagar genera una **ganancia o pérdida patrimonial** que tributa en la base del ahorro (19-28%).\n\n## Modelo 721: declaración informativa\n\nSi tienes más de 50.000 € en plataformas extranjeras (Binance, Coinbase, Kraken), debes presentar el Modelo 721 antes del 31 de marzo. Las multas mínimas son de 5.000 € por falta de información.\n\n## Cómo se calcula la ganancia\n\nPrecio de venta - precio de compra (método FIFO). El cambio cripto a cripto también es hecho imponible. El staking y los airdrops tributan como rendimientos del capital mobiliario.\n\n## Pérdidas: cómo compensarlas\n\nLas pérdidas en cripto compensan ganancias del ahorro al 100%. Si no las usas, se trasladan 4 años. Útil para hacer **tax loss harvesting** al cierre del ejercicio.`,
  },
  {
    slug: "deducciones-irpf-comunidades-autonomas-2025",
    title: "Las mejores deducciones autonómicas del IRPF 2026",
    excerpt: "Cada comunidad tiene sus deducciones. Estas son las que más dinero te ahorran si vives en Madrid, Cataluña o Valencia.",
    date: "2026-02-28",
    readMinutes: 6,
    category: "IRPF",
    content: `## Deducciones poco conocidas que reducen tu IRPF\n\nMuchos contribuyentes pagan más de lo necesario por no conocer las deducciones autonómicas. Aquí las que más impacto tienen.\n\n## Madrid\n\n- Por nacimiento o adopción: 600 € (primer hijo), 750 € (segundo), 900 € (tercero).\n- Por familia numerosa: 50% de la cuota.\n- Alquiler vivienda habitual <35 años: 30%, hasta 1.237 €.\n\n## Cataluña\n\n- Donativos a entidades en defensa de la lengua catalana: 15%.\n- Por nacimiento o adopción: 150 €.\n- Por alquiler vivienda habitual: 10%, hasta 300 €.\n\n## Valencia\n\n- Por familia numerosa: 300-600 €.\n- Por adquisición de material escolar: 100 € por hijo.\n- Por gastos en gimnasios y actividad física: 30%, hasta 150 €.\n\n## Cómo aplicarlas\n\nNo aparecen en el borrador. Debes incluirlas manualmente en Renta Web. Conserva siempre justificantes durante 4 años por si Hacienda los reclama.`,
  },
  {
    slug: "tarifa-plana-autonomos-2025",
    title: "Tarifa plana de autónomos 2026: cómo aprovecharla al máximo",
    excerpt: "80 € al mes el primer año y posible prórroga. Te explicamos requisitos, plazos y trucos.",
    date: "2026-01-15",
    readMinutes: 5,
    category: "Autónomos",
    content: `## Qué es la tarifa plana\n\nLa tarifa plana es una bonificación a la cuota RETA para nuevos autónomos: pagas solo **80 €/mes durante los primeros 12 meses**, en lugar de los 200-590 € habituales del nuevo sistema por tramos.\n\n## Requisitos\n\n- No haber estado de alta como autónomo en los últimos 2 años (3 si ya disfrutaste tarifa plana antes).\n- No ser autónomo colaborador ni socio de sociedad mercantil con control efectivo.\n\n## Cómo se prorroga\n\nLos siguientes 12 meses (mes 13 al 24), si tus rendimientos netos no superan el SMI (15.876 € en 2026), puedes prorrogar los 80 €/mes solicitándolo expresamente.\n\n## Bonificaciones adicionales\n\nMujeres menores de 35 y hombres menores de 30: 30% extra durante 12 meses tras la tarifa plana. En municipios <5.000 habitantes: tarifa plana ampliada a 24 meses.`,
  },
];

export function getPost(slug: string) { return POSTS.find((p) => p.slug === slug); }