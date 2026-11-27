import { Assembly } from "@/components/site/Assembly";
import { Explore } from "@/components/site/Explore";
import { Faq } from "@/components/site/Faq";
import { FloatingCtas, Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Intro } from "@/components/site/Intro";
import { Loader } from "@/components/site/Loader";
import { Marquee } from "@/components/site/Marquee";
import { PlanRoom } from "@/components/site/PlanRoom";
import { Problems } from "@/components/site/Problems";
import { Products } from "@/components/site/Products";
import { Certs, Services, Welcome } from "@/components/site/Services";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Solution } from "@/components/site/Solution";
import { Uses } from "@/components/site/Uses";
import { Why } from "@/components/site/Why";
import { homeJsonLd } from "@/lib/site";

export default function Home() {
  const jsonLd = JSON.stringify(homeJsonLd()).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <a
        href="#main"
        className="sr-only z-[300] bg-ink px-4 py-3 font-tech text-[15px] font-semibold uppercase tracking-[0.05em] text-paper focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Skip to content
      </a>
      <Loader />
      <SmoothScroll />
      <div className="min-h-screen overflow-x-clip">
        <Header />
        <main id="main">
          <Hero />
          <Marquee />
          <Intro />
          <Problems />
          <Solution />
          <Assembly />
          <Why />
          <Products />
          <PlanRoom />
          <Uses />
          <Services />
          <Welcome />
          <Certs />
          <Faq />
          <Explore />
        </main>
        <Footer />
      </div>
      <FloatingCtas />
    </>
  );
}
