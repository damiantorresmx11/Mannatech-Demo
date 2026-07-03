import { getPage } from "@/lib/payload";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { ImpactoContent } from "./ImpactoContent";

export default async function ImpactoPage() {
  const cmsPage = await getPage("impacto");
  if (cmsPage?.layout?.length) {
    return <BlockRenderer blocks={cmsPage.layout} />;
  }

  return <ImpactoContent />;
}
