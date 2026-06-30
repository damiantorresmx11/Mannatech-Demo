import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col pt-[calc(72px+var(--announcement-bar-height))]">{children}</main>
      <Footer />
    </>
  );
}
