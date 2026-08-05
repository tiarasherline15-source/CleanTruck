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
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-85" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-2xl space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground backdrop-blur-sm border border-primary-foreground/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            Now serving Nairobi County
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight">
            Clean Communities,{" "}
            <span className="text-accent">Healthier Future</span>
          </h1>

          <p className="text-lg text-primary-foreground/80 max-w-xl">
            Schedule garbage collection with ease. Our digital platform connects residents 
            with waste collectors for timely, reliable service across Kenya.
          </p>

          <ul className="flex flex-wrap gap-4">
            {features.map((feature) => (
              <li 
                key={feature} 
                className="flex items-center gap-2 text-primary-foreground/90"
              >
                <CheckCircle className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Schedule Pickup
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
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