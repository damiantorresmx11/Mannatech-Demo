import { getCMSPage } from "@/lib/cms-api";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { UneteContent } from "./UneteContent";

export default async function UnetePage() {
  const cmsPage = await getCMSPage("unete");
  if (cmsPage?.blocks?.length) {
    return <CMSPageRenderer blocks={cmsPage.blocks} />;
  }
  return <UneteContent />;
}
