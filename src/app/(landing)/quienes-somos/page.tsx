import { getCMSPage } from "@/lib/cms-api";
import { CMSPageRenderer } from "@/components/cms/CMSPageRenderer";
import { QuienesSomosContent } from "./QuienesSomosContent";

export default async function QuienesSomosPage() {
  const cmsPage = await getCMSPage("quienes-somos");
  if (cmsPage?.blocks?.length) {
    return <CMSPageRenderer blocks={cmsPage.blocks} />;
  }
  return <QuienesSomosContent />;
}
