import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import heroBg from "@/assets/hero.png";

const HeroSection = () => {
  const features = [
    "Easy online scheduling",
    "Real-time tracking",
    "Reliable service",
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full space-y-8 animate-fade-in-up flex flex-col items-center text-center">
          

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight max-w-3xl whitespace-nowrap">
            Smarter Waste Solutions for <br></br><span className="text-3xl sm:text-4xl text-[#0eecb4] ">Cleaner Cities</span>
          </h1>

          <p className="text-lg text-white max-w-2xl">
            Schedule garbage collection with ease. Making waste collection more organized, reliable, and accessible for residents, collectors, and 
            administrators across Kenya.
          </p>

          <ul className="flex flex-wrap gap-4 justify-center pt-4 text-white">
            {features.map((feature) => (
              <li 
                key={feature} 
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 pt-4 justify-center">
            <Button variant="hero" asChild className="bg-[#1D9E75] hover:bg-[#0b9c8a] text-primary-foreground">
              <Link to="/register">
                Schedule Pickup
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;