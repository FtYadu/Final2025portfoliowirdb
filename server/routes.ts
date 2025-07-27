import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Portfolio Images API
  app.get("/api/portfolio", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;
      const images = await storage.getPortfolioImages(limit, offset, category);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio images" });
    }
  });

  app.get("/api/portfolio/all", async (req, res) => {
    try {
      const category = req.query.category as string;
      const images = await storage.getAllPortfolioImages(category);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all portfolio images" });
    }
  });

  // Portfolio categories API
  app.get("/api/portfolio/categories", async (req, res) => {
    try {
      const categories = await storage.getPortfolioCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio categories" });
    }
  });

  // Contact Form Submission API
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      
      // In a real implementation, you would integrate with Formspree here
      // For now, we'll just store it locally and return success
      res.json({ 
        message: "Contact submission received successfully",
        id: submission.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid contact form data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to submit contact form" });
      }
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Blog routes
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // CV download route
  app.get("/api/cv/download", (req, res) => {
    // Return CV information
    res.json({ 
      url: "/attached_assets/yadu-krishna-cv.pdf",
      name: "Yadu_Krishna_CV.pdf"
    });
  });

  // Vimeo videos route
  app.get("/api/vimeo/videos", async (req, res) => {
    try {
      // Sample Vimeo videos data - in production, this would fetch from Vimeo API
      const vimeoVideos = [
        {
          id: "video-1",
          filename: "Creative Showcase Reel",
          imageurl: "https://i.vimeocdn.com/video/1234567890_1280x720.jpg",
          caption: "My latest creative showcase featuring visual storytelling",
          type: "video",
          videoId: "824804225", // Example Vimeo video ID
          order: 1
        },
        {
          id: "video-2", 
          filename: "Behind the Scenes",
          imageurl: "https://i.vimeocdn.com/video/0987654321_1280x720.jpg",
          caption: "Behind the scenes of a recent photoshoot",
          type: "video",
          videoId: "824804226", // Example Vimeo video ID
          order: 2
        }
      ];
      
      res.json(vimeoVideos);
    } catch (error) {
      console.error("Error fetching Vimeo videos:", error);
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
