import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/Layout";
import { Breadcrumbs } from "../components/Breadcrumbs";

export const Route = createFileRoute("/politica-privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad · CalculaFácil" },
      { name: "description", content: "Política de privacidad y protección de datos de CalculaFácil conforme al RGPD." },
      { property: "og:title", content: "Política de privacidad" },
      { property: "og:url", content: "/politica-privacidad" },
    ],
    links: [{ rel: "canonical", href: "/politica-privacidad" }],
  }),
  component: () => (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10 space-y-5">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Política de privacidad" }]} />
        <h1 className="text-4xl font-extrabold tracking-tight">Política de privacidad</h1>
        <p>En CalculaFácil nos tomamos tu privacidad muy en serio. Esta política explica cómo tratamos tus datos conforme al Reglamento General de Protección de Datos (UE) 2016/679 y la LOPDGDD 3/2018.</p>
        <h2 className="text-2xl font-bold mt-6">Datos que recopilamos</h2>
        <p>Las calculadoras del Sitio funcionan <strong>íntegramente en tu navegador</strong>. Los datos que introduces (sueldos, importes, fechas) nunca salen de tu dispositivo, no se transmiten a nuestros servidores ni se almacenan en bases de datos.</p>
        <h2 className="text-2xl font-bold mt-6">Cookies y analítica</h2>
        <p>Utilizamos cookies técnicas necesarias para el funcionamiento del Sitio y, con tu consentimiento, cookies de analítica anónimas para entender qué calculadoras son más útiles. Puedes gestionarlas en cualquier momento desde tu navegador.</p>
        <h2 className="text-2xl font-bold mt-6">Publicidad</h2>
        <p>Mostramos publicidad de terceros (Google AdSense). Estos proveedores pueden usar cookies para personalizar anuncios conforme a tu navegación. Consulta su política de privacidad para más detalles.</p>
        <h2 className="text-2xl font-bold mt-6">Tus derechos</h2>
        <p>Tienes derecho a acceder, rectificar, suprimir, oponerte y solicitar la portabilidad de tus datos personales contactando con nosotros. Al no almacenar datos identificativos, estos derechos rara vez aplicarán al uso de las calculadoras.</p>
      </div>
    </PageShell>
  ),
});