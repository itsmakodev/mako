import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const Route = createFileRoute("/aviso-legal")({
  head: () => ({
    meta: [
      { title: "Aviso legal · CalculaFácil" },
      { name: "description", content: "Aviso legal y condiciones de uso de CalculaFácil." },
      { property: "og:title", content: "Aviso legal" },
      { property: "og:url", content: "/aviso-legal" },
    ],
    links: [{ rel: "canonical", href: "/aviso-legal" }],
  }),
  component: () => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10 prose-custom space-y-5">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Aviso legal" }]} />
        <h1 className="text-4xl font-extrabold tracking-tight">Aviso legal</h1>
        <p>El presente aviso legal regula el uso del sitio web CalculaFácil (en adelante, "el Sitio"), conforme a lo dispuesto en la Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE).</p>
        <h2 className="text-2xl font-bold mt-6">Objeto</h2>
        <p>El Sitio ofrece calculadoras y contenidos informativos sobre fiscalidad, hipotecas, trabajo y finanzas personales en España. La información proporcionada tiene carácter meramente orientativo y no constituye asesoramiento financiero, fiscal ni legal.</p>
        <h2 className="text-2xl font-bold mt-6">Exención de responsabilidad</h2>
        <p>Aunque actualizamos periódicamente los cálculos con la normativa vigente, no garantizamos la exactitud absoluta de los resultados. El usuario debe contrastar la información con un asesor profesional antes de tomar decisiones que tengan impacto económico.</p>
        <h2 className="text-2xl font-bold mt-6">Propiedad intelectual</h2>
        <p>Todos los contenidos (textos, gráficos, código, diseño) son propiedad de CalculaFácil o de sus respectivos titulares. Queda prohibida su reproducción total o parcial sin autorización expresa.</p>
        <h2 className="text-2xl font-bold mt-6">Legislación aplicable</h2>
        <p>El presente aviso se rige por la legislación española. Las partes se someten a los tribunales competentes según la normativa aplicable.</p>
      </div>
    </PageShell>
  ),
});