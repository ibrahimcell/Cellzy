import ModalProvider from "./components/ModalProvider";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MarqueeStrip from "./components/MarqueeStrip";
import ProductGrid from "./components/ProductGrid";
import BentoSections from "./components/BentoSections";
import AccessoriesHub from "./components/AccessoriesHub";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <ModalProvider>
      <Navbar />
      <HeroSection />
      <MarqueeStrip />
      <ProductGrid />
      <BentoSections />
      <AccessoriesHub />
      <Footer />
    </ModalProvider>
  );
}
