import { getCMSPage } from "@/lib/cms-api";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { ImpactoContent } from "./ImpactoContent";

export default async function ImpactoPage() {
  const cmsPage = await getCMSPage("impacto");
  if (cmsPage?.blocks?.length) {
    return <CMSPageRenderer blocks={cmsPage.blocks} />;
  }
  return <ImpactoContent />;
}
