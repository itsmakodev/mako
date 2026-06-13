import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const Route = createFileRoute("/quienes-somos")({
  head: () => ({
    meta: [
      { title: "Quiénes somos · CalculaFácil" },
      { name: "description", content: "Quiénes somos y por qué creamos CalculaFácil: hacer accesibles las calculadoras financieras y fiscales para España." },
      { property: "og:title", content: "Quiénes somos · CalculaFácil" },
      { property: "og:description", content: "Calculadoras financieras y fiscales accesibles para todo el mundo." },
      { property: "og:url", content: "/quienes-somos" },
    ],
    links: [{ rel: "canonical", href: "/quienes-somos" }],
  }),
  component: () => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Quiénes somos" }]} />
        <h1 className="text-4xl font-extrabold tracking-tight mb-6">Quiénes somos</h1>
        <div className="space-y-5 text-lg text-foreground/90 leading-relaxed">
          <p>CalculaFácil nace con una misión clara: democratizar el acceso a herramientas financieras y fiscales en España. Cada año, millones de personas se enfrentan a decisiones importantes — comprar una vivienda, dejar un trabajo, hacerse autónomo, planificar la jubilación — sin tener claro el impacto económico real.</p>
          <p>Creemos que entender tu dinero no debería requerir un asesor caro. Por eso construimos calculadoras precisas, actualizadas con la normativa vigente (AEAT, Seguridad Social, BOE) y completamente gratuitas. Sin registros, sin emails, sin publicidad intrusiva.</p>
          <p>Todos nuestros cálculos se realizan en tu navegador: tus datos nunca salen de tu dispositivo. La transparencia y la privacidad son innegociables.</p>
        </div>
      </div>
    </PageShell>
  ),
});