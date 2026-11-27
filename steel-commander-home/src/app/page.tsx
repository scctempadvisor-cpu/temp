import { Assembly } from "@/components/site/Assembly";
import { Explore } from "@/components/site/Explore";
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

export default function Home() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <main className="min-h-screen overflow-x-clip">
        <Header />
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
        <Explore />
        <Footer />
      </main>
      <FloatingCtas />
    </>
  );
}
