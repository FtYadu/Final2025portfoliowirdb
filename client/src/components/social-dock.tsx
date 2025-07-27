import { 
  Instagram, 
  Twitter, 
  Linkedin, 
  Github, 
  Youtube, 
  Music,
  Camera,
  Hash,
  Facebook
} from "lucide-react";
import { socialLinks } from "@/lib/portfolio-data";

const socialIcons = [
  { icon: Instagram, href: socialLinks.instagram, color: "#E4405F", label: "Instagram" },
  { icon: Twitter, href: socialLinks.twitter, color: "#1DA1F2", label: "Twitter" },
  { icon: Linkedin, href: socialLinks.linkedin, color: "#0077B5", label: "LinkedIn" },
  { icon: Github, href: socialLinks.github, color: "#333", label: "GitHub" },
  { icon: Youtube, href: socialLinks.youtube, color: "#FF0000", label: "YouTube" },
  { icon: Music, href: socialLinks.spotify, color: "#1DB954", label: "Spotify" },
  { icon: Camera, href: socialLinks.px500, color: "#0099E5", label: "500px" },
  { icon: Hash, href: socialLinks.threads, color: "#000", label: "Threads" },
  { icon: Facebook, href: socialLinks.facebook, color: "#1877F2", label: "Facebook" },
];

export function SocialDock() {
  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-[100] flex flex-col gap-4">
      {socialIcons.map(({ icon: Icon, href, color, label }, index) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group"
          style={{
            "--accent-color": color,
          } as React.CSSProperties}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
          }}
        >
          <Icon className="w-5 h-5" />
          <span className="sr-only">{label}</span>
        </a>
      ))}
    </div>
  );
}
