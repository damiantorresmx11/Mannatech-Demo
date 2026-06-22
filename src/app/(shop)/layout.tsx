import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header variant="shop" />
      <main className="flex-1 flex flex-col pt-[72px]">{children}</main>
      <Footer />
    </>
  );
}
