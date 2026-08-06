import { Calendar, Truck, BarChart3, Shield, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "Easy Scheduling",
    description: "Book garbage collection at your convenience with just a few clicks.",
    color: "#7C3AED",
  },
  {
    icon: Truck,
    title: "Real-Time Tracking",
    description: "Track your collection request status and know exactly when to expect pickup.",
    color: "#0D9488",
  },
  {
    icon: Clock,
    title: "Timely Service",
    description: "Reliable and punctual waste collection to keep your environment clean.",
    color: "#D97706",
  },
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Your data is protected with role-based access control and encryption.",
    color: "#DC2626",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Administrators get detailed insights for data-driven decisions.",
    color: "#4F46E5",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    description: "Tailored dashboards for residents, collectors, and administrators.",
    color: "#2563EB",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Key <span className="text-[#0eecb4]">Features</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our platform bridges the gap between residents and waste collectors, 
            making urban sanitation more efficient and accountable.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group border-border/50 bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4 group-hover:scale-110 transition-transform duration-300" style={{ color: feature.color }}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;