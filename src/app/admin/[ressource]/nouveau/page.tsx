import { notFound } from "next/navigation";
import { exigerSession } from "@/lib/auth";
import { chargerOptionsRelations } from "@/lib/relations";
import { trouverRessource } from "@/lib/ressources";
import FormulaireRessource from "@/components/admin/FormulaireRessource";

export const dynamic = "force-dynamic";

export default async function NouvelleRessource({
  params,
}: {
  params: Promise<{ ressource: string }>;
}) {
  await exigerSession();
  const { ressource: cle } = await params;

  const ressource = trouverRessource(cle);
  if (!ressource || ressource.lectureSeule) notFound();

  const optionsRelations = await chargerOptionsRelations(ressource);
  return <FormulaireRessource cle={ressource.cle} optionsRelations={optionsRelations} />;
}
