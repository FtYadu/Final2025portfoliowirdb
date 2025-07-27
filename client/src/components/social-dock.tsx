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
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[100] flex flex-row gap-3 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full px-6 py-3">
      {socialIcons.map(({ icon: Icon, href, color, label }, index) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-all duration-300 hover:scale-110 group"
          style={{
            "--accent-color": color,
          } as React.CSSProperties}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = color;
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "";
            e.currentTarget.style.color = "";
          }}
        >
          <Icon className="w-5 h-5" />
          <span className="sr-only">{label}</span>
        </a>
      ))}
    </div>
  );
}
