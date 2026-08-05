import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Recycle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div
        className="relative overflow-hidden rounded-3xl bg-cover bg-center p-8 sm:p-12 lg:p-16"
        style={{ backgroundImage: `url('/hamza-javaid-PizD8punZsw-unsplash.jpg')` }}
      >
          {/* Decorative Pattern */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10">
              <Recycle className="h-40 w-40" />
            </div>
            <div className="absolute bottom-10 right-10">
              <Recycle className="h-32 w-32" />
            </div>
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready for a Cleaner Environment?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              This platform is designed to improve the organization and efficiency of waste collection services by enabling better coordination between residents, collectors, and administrators. It helps address common challenges such as delayed collections, limited visibility of operations, 
              and poor communication by providing a structured and accountable approach to waste management.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" asChild className="bg-[#1D9E75] hover:bg-[#0b9c8a]">
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero-outline"  asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;