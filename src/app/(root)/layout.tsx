import Footer from "@/components/footer";
import AnimationWrapper from "@/components/animation-wrapper";
import Header from "@/components/shared/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper">
        <AnimationWrapper>{children}</AnimationWrapper>
      </main>
      <Footer />
    </div>
  );
}
