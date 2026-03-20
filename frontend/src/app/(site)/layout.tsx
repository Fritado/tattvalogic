import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReadyToBuild from "@/components/shared/ReadyToBuild";
import CookieBanner from "@/components/shared/CookieBanner";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        {children}
      </main>
      <ReadyToBuild />
      <Footer />
      <CookieBanner />
    </>
  );
}
