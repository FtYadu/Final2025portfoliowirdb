import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavMenu } from "@/components/nav-menu";
import { SpiralSocialDock } from "@/components/spiral-social-dock";
import { Check, Camera, Users, Clock, Star } from "lucide-react";
import type { PortfolioImage } from "@shared/schema";

interface Package {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  recommended?: boolean;
  description: string;
}

const packages: Package[] = [
  {
    id: "basic",
    name: "Essential",
    price: "₹15,000",
    duration: "2-3 hours",
    description: "Perfect for individual portraits and small events",
    features: [
      "Up to 3 hours of shooting",
      "50+ edited photos",
      "Basic retouching",
      "Digital delivery",
      "1 location"
    ]
  },
  {
    id: "professional",
    name: "Professional",
    price: "₹35,000",
    duration: "Full day",
    description: "Ideal for weddings, corporate events, and brand shoots",
    recommended: true,
    features: [
      "6-8 hours of coverage",
      "150+ edited photos",
      "Advanced retouching",
      "Digital + Print ready files",
      "Multiple locations",
      "Assistant photographer",
      "Priority support"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: "₹60,000+",
    duration: "Multi-day",
    description: "Complete visual storytelling for your special occasions",
    features: [
      "Multi-day coverage",
      "300+ edited photos",
      "Cinematic video highlights",
      "Premium album design",
      "Drone photography",
      "Team of photographers",
      "Same-day previews",
      "Lifetime storage"
    ]
  }
];

export default function Packages() {
  const [isScrolling, setIsScrolling] = useState(false);
  const { data: images = [] } = useQuery<PortfolioImage[]>({
    queryKey: ['/api/portfolio/all']
  });

  // Get random background images
  const bgImages = images.slice(0, 3).map(img => img.imageurl);

  return (
    <>
      <NavMenu isScrolling={isScrolling} onToggleScroll={() => setIsScrolling(!isScrolling)} />
      <SpiralSocialDock />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section with Portfolio Images */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-3 opacity-20">
            {bgImages.map((img, idx) => (
              <div key={idx} className="relative">
                <img 
                  src={img} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>
            ))}
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-wider mb-6">
              PACKAGES
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light italic">
              Choose the perfect photography package for your needs
            </p>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`relative rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${
                    pkg.recommended 
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-2xl' 
                      : 'bg-card border border-border hover:border-accent-purple'
                  }`}
                >
                  {pkg.recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-accent-gold text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Star className="w-4 h-4" /> RECOMMENDED
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                      <p className={`text-sm ${pkg.recommended ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {pkg.description}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="text-4xl font-black mb-2">{pkg.price}</div>
                      <div className={`flex items-center justify-center gap-1 text-sm ${
                        pkg.recommended ? 'text-white/80' : 'text-muted-foreground'
                      }`}>
                        <Clock className="w-4 h-4" />
                        {pkg.duration}
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className={`w-5 h-5 mt-0.5 ${
                            pkg.recommended ? 'text-accent-gold' : 'text-accent-purple'
                          }`} />
                          <span className={`text-sm ${
                            pkg.recommended ? 'text-white/90' : ''
                          }`}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      pkg.recommended
                        ? 'bg-white text-purple-600 hover:bg-white/90'
                        : 'bg-accent-purple text-white hover:bg-accent-purple/80'
                    }`}>
                      Choose {pkg.name}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-20 text-center max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Custom Packages Available</h3>
              <p className="text-muted-foreground mb-8">
                Don't see what you're looking for? I create custom packages tailored to your specific needs, 
                whether it's a destination wedding, commercial project, or creative collaboration.
              </p>
              <button className="px-8 py-3 bg-accent-purple text-white rounded-full font-semibold hover:bg-accent-purple/80 transition-all duration-300">
                Get Custom Quote
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}