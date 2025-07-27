import { useState, useRef, useEffect } from "react";
import { 
  MessageCircle,
  Calendar,
  Globe,
  Share2
} from "lucide-react";
import { 
  SiInstagram,
  SiX,
  SiLinkedin,
  SiGithub,
  SiYoutube,
  SiSpotify,
  Si500Px,
  SiThreads,
  SiFacebook,
  SiPinterest,
  SiTiktok
} from "react-icons/si";
import { socialLinks } from "@/lib/portfolio-data";
import gsap from "gsap";

const socialIcons = [
  { icon: SiInstagram, href: socialLinks.instagram, color: "#E4405F", label: "Instagram" },
  { icon: SiX, href: socialLinks.twitter, color: "#000000", label: "X (Twitter)" },
  { icon: SiLinkedin, href: socialLinks.linkedin, color: "#0077B5", label: "LinkedIn" },
  { icon: SiGithub, href: socialLinks.github, color: "#333333", label: "GitHub" },
  { icon: SiYoutube, href: socialLinks.youtube, color: "#FF0000", label: "YouTube" },
  { icon: SiSpotify, href: socialLinks.spotify, color: "#1DB954", label: "Spotify" },
  { icon: MessageCircle, href: socialLinks.whatsapp, color: "#25D366", label: "WhatsApp" },
  { icon: Calendar, href: socialLinks.calendar, color: "#4285F4", label: "Calendar" },
  { icon: Globe, href: socialLinks.portfolio, color: "#FF6B6B", label: "Portfolio" },
  { icon: SiPinterest, href: socialLinks.pinterest, color: "#BD081C", label: "Pinterest" },
  { icon: SiTiktok, href: socialLinks.tiktok, color: "#000000", label: "TikTok" },
  { icon: SiFacebook, href: socialLinks.facebook, color: "#1877F2", label: "Facebook" },
  { icon: SiThreads, href: socialLinks.threads, color: "#000000", label: "Threads" },
  { icon: Si500Px, href: socialLinks.px500, color: "#0099E5", label: "500px" },
];

export function SpiralSocialDock() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create GSAP timeline
    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    // Calculate spiral positions
    const radius = 120;
    const angleStep = (2 * Math.PI) / socialIcons.length;
    const spiralTurns = 2;

    iconsRef.current.forEach((icon, index) => {
      if (!icon) return;
      
      const angle = angleStep * index;
      const spiralRadius = (radius / socialIcons.length) * (index + 1);
      const finalRadius = radius;
      
      // Spiral out animation
      tl.to(icon, {
        rotation: 360 * spiralTurns,
        x: Math.cos(angle) * finalRadius,
        y: Math.sin(angle) * finalRadius,
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      }, index * 0.03);
    });

    return () => {
      tl.kill();
    };
  }, []);

  const toggleOpen = () => {
    if (!tlRef.current) return;

    if (isOpen) {
      tlRef.current.reverse();
    } else {
      tlRef.current.play();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100]"
    >
      {/* Central trigger button */}
      <button
        onClick={toggleOpen}
        className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110"
        style={{
          boxShadow: isOpen ? '0 0 30px rgba(168, 85, 247, 0.5)' : '0 4px 20px rgba(0,0,0,0.2)'
        }}
      >
        <Share2 
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Social icons */}
      {socialIcons.map(({ icon: Icon, href, color, label }, index) => (
        <div
          key={label}
          ref={el => {
            if (el) iconsRef.current[index] = el;
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: 0,
            scale: 0.3,
          }}
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group block"
            onClick={(e) => {
              if (!isOpen) {
                e.preventDefault();
              }
            }}
          >
            <div 
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-gray-700 dark:text-gray-300 transition-all duration-300 hover:scale-125"
              style={{
                backgroundColor: isOpen ? `${color}20` : '',
                borderColor: color,
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
              onMouseEnter={(e) => {
                if (isOpen) {
                  e.currentTarget.style.backgroundColor = color;
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${color}50`;
                }
              }}
              onMouseLeave={(e) => {
                if (isOpen) {
                  e.currentTarget.style.backgroundColor = `${color}20`;
                  e.currentTarget.style.color = '';
                  e.currentTarget.style.boxShadow = '';
                }
              }}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {label}
            </span>
          </a>
        </div>
      ))}
    </div>
  );
}