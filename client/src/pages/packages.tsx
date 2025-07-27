import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { NavMenu } from "@/components/nav-menu";
import { SpiralSocialDock } from "@/components/spiral-social-dock";

interface Package {
  name: string;
  price: string;
  description: string;
}

interface Category {
  id: string;
  emoji: string;
  title: string;
  tagline: string;
  packages: Package[];
}

interface Addon {
  name: string;
  price: string;
}

export default function Packages() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const categories: Category[] = [
    {
      id: 'photography',
      emoji: '📸',
      title: 'Photography',
      tagline: 'Freeze the Vibe',
      packages: [
        {
          name: 'FLASHY STARTER',
          price: 'AED 500',
          description: '1 hr shoot, 15 edits, 3-day delivery'
        },
        {
          name: 'DRIP MODE',
          price: 'AED 900',
          description: '2 hrs, 2 looks, 30 edits, BTS reel optional'
        },
        {
          name: 'HYPER REALITY',
          price: 'AED 1,500',
          description: '4 hrs shoot, 50+ edits, creative moodboard'
        }
      ]
    },
    {
      id: 'videography',
      emoji: '🎥',
      title: 'Videography',
      tagline: 'Roll the Vibes',
      packages: [
        {
          name: 'REEL DEAL',
          price: 'AED 600',
          description: '1 min reel, 1 hr shoot'
        },
        {
          name: 'CINEVIBE',
          price: 'AED 1,100',
          description: '2–3 mins cinematic edit, color grade, music'
        },
        {
          name: 'STORYBOMB',
          price: 'AED 2,000+',
          description: 'Full-day shoot, brand storytelling, scripting'
        }
      ]
    },
    {
      id: 'ai-content',
      emoji: '🧠',
      title: 'AI Content',
      tagline: 'Future Flex',
      packages: [
        {
          name: 'AI Model Portraits',
          price: 'AED 400',
          description: '10–20 ultra-realistic images'
        },
        {
          name: 'AI Video Concepts',
          price: 'AED 750',
          description: '15–30 sec AI video with script'
        },
        {
          name: 'AI Product Mockups',
          price: 'AED 500',
          description: '8–10 AI-rendered creatives'
        }
      ]
    },
    {
      id: 'combo-deals',
      emoji: '🎭',
      title: 'Combo Deals',
      tagline: 'Double Dose',
      packages: [
        {
          name: "CREATOR'S BOOST",
          price: 'AED 1,500',
          description: '20 photos + 1 reel + 1 AI-enhanced concept'
        },
        {
          name: 'BRAND BANGER',
          price: 'AED 3,500',
          description: '2–3 videos + 40 photos + AI voice & graphics'
        }
      ]
    }
  ];

  const addons: Addon[] = [
    { name: 'RAW files', price: 'AED 200' },
    { name: 'Voiceover', price: 'AED 400' },
    { name: 'Motion Graphics', price: 'AED 250' },
    { name: 'Express Delivery', price: 'AED 250' },
    { name: 'AI Scene Extension', price: 'AED 300' }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <>
      <NavMenu isScrolling={isScrolling} onToggleScroll={() => setIsScrolling(!isScrolling)} />
      <SpiralSocialDock />
      
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16" data-gsap-fade>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white">
              Rate Card
            </h1>
            <p className="text-xl text-gray-400">
              Premium creative services tailored to your vision
            </p>
          </div>

          {/* Category Accordions */}
          <div className="max-w-4xl mx-auto space-y-4 mb-16">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div
                  onClick={() => toggleCategory(category.id)}
                  className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{category.emoji}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {category.title}
                        </h2>
                        <p className="text-gray-400 text-sm italic">
                          "{category.tagline}"
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedCategory === category.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    </motion.div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedCategory === category.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6 space-y-4 border-t border-white/10 pt-6">
                          {category.packages.map((pkg, pkgIndex) => (
                            <motion.div
                              key={pkgIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: pkgIndex * 0.05 }}
                              className="backdrop-blur-md bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-white mb-1">
                                    {pkg.name}
                                  </h3>
                                  <p className="text-gray-400 text-sm">
                                    {pkg.description}
                                  </p>
                                </div>
                                <span className="text-lg font-bold text-accent-purple whitespace-nowrap ml-4">
                                  {pkg.price}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add-ons Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-4xl mx-auto"
            data-gsap-fade
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
              <span>⚙️</span>
              <span>Add-ons</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {addons.map((addon, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] cursor-pointer"
                >
                  <h3 className="text-white font-semibold mb-1">{addon.name}</h3>
                  <p className="text-accent-purple font-bold">{addon.price}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
            data-gsap-fade
          >
            <p className="text-gray-400 mb-6">
              Need something custom? Let's create magic together.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-pink rounded-full font-semibold text-white hover:shadow-[0_8px_32px_rgba(168,85,247,0.5)] transition-all duration-300 hover:scale-105">
              Get Custom Quote
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}