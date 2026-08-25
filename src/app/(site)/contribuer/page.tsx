import type { Metadata } from "next";
import FormulaireContribution from "@/components/FormulaireContribution";
import { EnTetePage } from "@/components/UI";

export const metadata: Metadata = {
  title: "Proposer un contenu",
  description:
    "Proposez une innovation, un profil de chercheur, une actualité ou un événement à publier sur Innov'Tchad.",
};

export default function PageContribuer() {
  return (
    <>
      <EnTetePage
        surtitre="Contribuer"
        titre="Proposer un contenu"
        description="Vous portez une innovation, vous menez des recherches ou vous organisez un événement scientifique ? Décrivez-le ci-dessous : la rédaction vous recontacte pour finaliser la publication."
      />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <FormulaireContribution />
      </div>
    </>
  );
}
