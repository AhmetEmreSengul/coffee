import AboutTimeSlot from "../components/AboutTimeSlot";
import CoffeeDisplay from "../components/CoffeeDisplay";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <CoffeeDisplay/>
      <AboutTimeSlot/>
      <Footer/>
    </div>
  );
};

export default LandingPage;
