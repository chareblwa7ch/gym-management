import { Download } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { PwaInstallPanel } from "@/components/pwa-install-panel";
import { getRequestLanguage } from "@/lib/i18n-server";
import { getPwaCopy } from "@/lib/pwa-copy";

export const metadata = {
  title: "Install App",
};

export default async function InstallPage() {
  const language = await getRequestLanguage();
  const copy = getPwaCopy(language);

  return (
    <div className="page-section">
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        icon={Download}
      />

      <PwaInstallPanel />
    </div>
  );
}
