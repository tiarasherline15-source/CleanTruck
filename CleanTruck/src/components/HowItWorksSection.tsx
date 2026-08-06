import { UserPlus, CalendarCheck, Truck, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up as a resident to access the scheduling system.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Schedule Pickup",
    description: "Choose your preferred date, time, and waste type.",
  },
  {
    icon: Truck,
    step: "03",
    title: "Collection",
    description: "Our collectors arrive at your location for pickup.",
  },
  {
    icon: ThumbsUp,
    step: "04",
    title: "Confirmation",
    description: "Receive confirmation once collection is complete.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It <span className="text-[#0eecb4]">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Getting started with CleanTruck is simple. Follow these easy steps to schedule your first collection.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={item.step} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 ">
                {/* Step Number Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#1D9E75] text-primary-foreground text-xs font-bold">
                  Step {item.step}
                </div>
                
                {/* Icon */}
                <div className="mt-4 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-[#0b9c8a] transition-colors duration-300" style={{ color: "#1D9E75" }}>
                  <item.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;