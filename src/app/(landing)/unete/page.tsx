import { getPage } from "@/lib/payload";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { UneteContent } from "./UneteContent";

export default async function UnetePage() {
  const cmsPage = await getPage("unete");
  if (cmsPage?.layout?.length) {
    return <BlockRenderer blocks={cmsPage.layout} />;
  }

  return <UneteContent />;
}
