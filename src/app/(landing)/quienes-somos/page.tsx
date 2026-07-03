import { getPage } from "@/lib/payload";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { QuienesSomosContent } from "./QuienesSomosContent";

export default async function QuienesSomosPage() {
  const cmsPage = await getPage("quienes-somos");
  if (cmsPage?.layout?.length) {
    return <BlockRenderer blocks={cmsPage.layout} />;
  }

  return <QuienesSomosContent />;
}
