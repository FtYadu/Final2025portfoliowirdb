/**
 * @fileoverview This file contains static data and utility functions related to the
 * portfolio, such as social media links, API endpoints, and helper functions.
 */

/**
 * @interface PortfolioItem
 * @description Defines the structure for a portfolio item.
 * @property {string} id - The unique identifier for the item.
 * @property {string} filename - The name of the file.
 * @property {string} imageurl - The URL of the image.
 * @property {string} caption - A descriptive caption for the item.
 * @property {number} [order] - The display order of the item.
 */
export interface PortfolioItem {
  id: string;
  filename: string;
  imageurl: string;
  caption: string;
  order?: number;
}

/**
 * @description An object containing URLs for various social media profiles and contact methods.
 */
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

/**
 * @description The endpoint URL for Formspree contact form submissions.
 */
export const formspreeEndpoint = "https://formspree.io/f/myzjjpny";

/**
 * Returns a random height from a predefined set of values. This can be used
 * for creating a varied masonry layout.
 * @returns {number} A random height value.
 */
export const getRandomHeight = () => {
  const heights = [200, 250, 300, 350, 400, 450];
  return heights[Math.floor(Math.random() * heights.length)];
};
