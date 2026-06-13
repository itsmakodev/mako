import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const Route = createFileRoute("/politica-cookies")({
  head: () => ({
    meta: [
      { title: "Política de cookies · CalculaFácil" },
      { name: "description", content: "Información sobre el uso de cookies en CalculaFácil." },
      { property: "og:title", content: "Política de cookies" },
      { property: "og:url", content: "/politica-cookies" },
    ],
    links: [{ rel: "canonical", href: "/politica-cookies" }],
  }),
  component: () => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10 space-y-5">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Política de cookies" }]} />
        <h1 className="text-4xl font-extrabold tracking-tight">Política de cookies</h1>
        <p>Una cookie es un pequeño archivo de texto que se almacena en tu navegador al visitar un sitio web. Sirve para que el Sitio recuerde información sobre tu visita.</p>
        <h2 className="text-2xl font-bold mt-6">Tipos de cookies que usamos</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Técnicas (esenciales):</strong> necesarias para el funcionamiento básico del Sitio.</li>
          <li><strong>Analíticas (opcionales):</strong> nos permiten conocer de forma anónima qué calculadoras se usan más.</li>
          <li><strong>Publicitarias (opcionales):</strong> de proveedores como Google AdSense para personalizar la publicidad.</li>
        </ul>
        <h2 className="text-2xl font-bold mt-6">Cómo gestionarlas</h2>
        <p>Puedes aceptar, rechazar o configurar las cookies desde el banner que aparece al entrar por primera vez. También puedes borrarlas desde la configuración de tu navegador en cualquier momento.</p>
      </div>
    </PageShell>
  ),
});