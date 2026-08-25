import FormulaireConnexion from "@/components/admin/FormulaireConnexion";
import { sessionCourante } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PageConnexion() {
  if (await sessionCourante()) redirect("/admin");
  return <FormulaireConnexion />;
}
