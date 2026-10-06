import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import Services from "./components/Services";
import Transformation from "./components/Transformation";
import Gallery from "./components/Gallery";
import Stats from "./components/Stats";
import Team from "./components/Team";
import Quiz from "./components/Quiz";
import Signature from "./components/Signature";
import Testimonials from "./components/Testimonials";
import Booking from "./components/Booking";
import Social from "./components/Social";
import FinalCTA from "./components/FinalCTA";
import Footer, { BackToTop } from "./components/Footer";
import { DriftWord } from "./components/ui/motion";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-rose-deep" aria-hidden />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative">
        <ScrollProgress />
        <Nav />
        <main>
          <Hero />
          <Manifesto />
          <Services />
          <Transformation />
          <Gallery />
          <Stats />
          <Team />
          <Quiz />
          <Signature />
          <Testimonials />
          <Booking />
          <DriftWord className="py-6 font-display text-[12vw] uppercase leading-none" distance={240}>
            Your beauty. <em className="text-rose-deep">Your aura.</em> Your beauty. <em className="text-rose-deep">Your aura.</em>
          </DriftWord>
          <Social />
          <FinalCTA />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </MotionConfig>
  );
}
