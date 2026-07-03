import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { getGlobal } from "@/lib/payload";
import { CMSProvider } from "@/lib/cms-context";

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [header, footer, navigation] = await Promise.all([
    getGlobal("header"),
    getGlobal("footer"),
    getGlobal("navigation"),
  ]);

  return (
    <CMSProvider globals={{ header, footer, navigation }}>
      <Header />
      <main className="flex-1 flex flex-col pt-[calc(72px+var(--announcement-bar-height))]">{children}</main>
      <Footer />
    </CMSProvider>
  );
}
