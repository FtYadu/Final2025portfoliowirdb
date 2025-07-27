import { 
  MessageCircle,
  Calendar,
  Globe
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

export function SocialDock() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] flex flex-row gap-1 bg-white/5 dark:bg-black/10 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-full px-3 py-2">
      {socialIcons.map(({ icon: Icon, href, color, label }, index) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group"
        >
          <div 
            className="w-8 h-8 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-all duration-300 hover:scale-125 hover:-translate-y-2"
            style={{
              "--accent-color": color,
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = color;
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.boxShadow = `0 4px 20px ${color}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "";
              e.currentTarget.style.color = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-black/80 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            {label}
          </span>
        </a>
      ))}
    </div>
  );
}
