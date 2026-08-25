import EnTete from "@/components/EnTete";
import PiedDePage from "@/components/PiedDePage";

export default function LayoutSite({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-nuit-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Aller au contenu
      </a>
      <EnTete />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <PiedDePage />
    </>
  );
}
