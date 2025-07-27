export interface PortfolioItem {
  id: string;
  filename: string;
  imageurl: string;
  caption: string;
  order?: number;
}

export const socialLinks = {
  instagram: "https://www.instagram.com/ft.yadu",
  twitter: "https://x.com/featyadu", 
  linkedin: "https://www.linkedin.com/in/ftyadu/",
  github: "https://github.com/FtYadu",
  youtube: "https://www.youtube.com/@Ft-Yadu",
  spotify: "https://open.spotify.com/user/312onl4epyo3mdbt62xivggwo5vq",
  whatsapp: "https://wa.me/message/X2NLGXMKNCAJF1",
  calendar: "https://calendar.google.com/calendar/u0/appointments/schedules/AcZssZ1ZZxdMPitAl5OoHCWrho9li5JeeBIop8SAJBUz7xnlCNS5_7spTf39oYG8EBWvEDNv_yqoCJDM",
  portfolio: "https://marsh-45.faces.site/yhyyttvpq6vl#portfolio",
  pinterest: "https://www.pinterest.com/yeahhdu/",
  tiktok: "https://www.tiktok.com/@ftyadu",
  facebook: "https://www.facebook.com/yeahh.du",
  threads: "https://www.threads.com/@ft.yadu",
  px500: "https://500px.com/p/ftyaduwork"
};

export const formspreeEndpoint = "https://formspree.io/f/myzjjpny";

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const getRandomHeight = () => {
  const heights = [200, 250, 300, 350, 400, 450];
  return heights[Math.floor(Math.random() * heights.length)];
};
