import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Innov'Tchad — l'actualité de l'innovation et de la recherche au Tchad",
    template: "%s · Innov'Tchad",
  },
  description:
    "Plateforme de valorisation des innovations, des projets technologiques et des travaux des chercheuses et chercheurs du Tchad.",
  keywords: [
    "Tchad",
    "innovation",
    "recherche scientifique",
    "chercheurs",
    "technologie",
    "N'Djaména",
  ],
  openGraph: {
    title: "Innov'Tchad",
    description:
      "L'actualité de l'innovation et de la recherche scientifique au Tchad : chercheurs, projets, événements et appels à candidatures.",
    locale: "fr_TD",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col font-sans">{children}</body>
    </html>
  );
}
