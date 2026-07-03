import { notFound } from "next/navigation";
import { getPage, getAllPageSlugs } from "@/lib/payload";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = slug.join("/");
  const page = await getPage(pageSlug);

  return {
    title: page?.meta?.title || page?.title,
    description: page?.meta?.description,
  };
}

export default async function DynamicCMSPage({ params }: Props) {
  const { slug } = await params;
  const pageSlug = slug.join("/");
  const page = await getPage(pageSlug);

  if (!page) return notFound();

  return <BlockRenderer blocks={page.layout} />;
}
