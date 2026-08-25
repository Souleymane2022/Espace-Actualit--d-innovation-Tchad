import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { exigerSession } from "@/lib/auth";
import { chargerOptionsRelations } from "@/lib/relations";
import { trouverRessource } from "@/lib/ressources";
import FormulaireRessource from "@/components/admin/FormulaireRessource";

export const dynamic = "force-dynamic";

export default async function ModifierRessource({
  params,
}: {
  params: Promise<{ ressource: string; id: string }>;
}) {
  await exigerSession();
  const { ressource: cle, id } = await params;

  const ressource = trouverRessource(cle);
  if (!ressource) notFound();

  const modele = prisma[ressource.modele as keyof typeof prisma] as unknown as {
    findUnique: (a: unknown) => Promise<Record<string, unknown> | null>;
  };
  const enregistrement = await modele.findUnique({ where: { id } });
  if (!enregistrement) notFound();

  const optionsRelations = await chargerOptionsRelations(ressource);

  return (
    <FormulaireRessource
      cle={ressource.cle}
      enregistrement={enregistrement}
      optionsRelations={optionsRelations}
    />
  );
}
