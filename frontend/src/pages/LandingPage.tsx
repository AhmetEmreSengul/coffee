import AboutTimeSlot from "../components/AboutTimeSlot";
import CoffeeDisplay from "../components/CoffeeDisplay";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <CoffeeDisplay/>
      <AboutTimeSlot/>
    </div>
  );
};

export default LandingPage;
