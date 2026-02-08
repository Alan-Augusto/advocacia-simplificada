import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBar from "./components/TrustBar";
import ProblemStatement from "./components/ProblemStatement";
import Services from "./components/Services";
import Differentials from "./components/Differentials";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import BlogPreview from "./components/BlogPreview";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <TrustBar />
      <ProblemStatement />
      <Services />
      <Differentials />
      <Testimonials />
      <FAQ />
      <BlogPreview />
      <CTA />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
