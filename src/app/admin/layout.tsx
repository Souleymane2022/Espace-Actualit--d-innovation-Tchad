import type { Metadata } from "next";
import { sessionCourante } from "@/lib/auth";
import NavigationAdmin from "@/components/admin/NavigationAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Espace rédaction",
  robots: { index: false, follow: false },
};

export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const session = await sessionCourante();

  if (!session) {
    return <div className="flex flex-1 items-center justify-center px-4 py-16">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row">
      <NavigationAdmin nom={session.nom} />
      <div className="min-w-0 flex-1 bg-sable-50">{children}</div>
    </div>
  );
}
