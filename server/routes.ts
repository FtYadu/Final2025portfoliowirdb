/**
 * @fileoverview This file defines and registers all the API routes for the Express application.
 * It sets up endpoints for handling portfolio data, contact form submissions, blog posts,
 * and other application-specific functionalities.
 */
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";

/**
 * Registers all API routes with the provided Express application instance.
 * @param {Express} app - The Express application instance to register the routes with.
 * @returns {Promise<Server>} A promise that resolves with the created HTTP server instance.
 */
export async function registerRoutes(app: Express): Promise<Server> {
  /**
   * @route GET /api/portfolio
   * @description Fetches a paginated list of portfolio images. Supports filtering by category.
   * @query {number} [limit=20] - The maximum number of images to return.
   * @query {number} [offset=0] - The starting offset for pagination.
   * @query {string} [category] - The category to filter images by.
   * @returns {object} 200 - An array of portfolio image objects.
   * @returns {object} 500 - An error message if fetching fails.
   */
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

  /**
   * @route GET /api/portfolio/all
   * @description Fetches all portfolio images, optionally filtered by a specific category.
   * @query {string} [category] - The category to filter images by.
   * @returns {object} 200 - An array of all portfolio image objects for the given category.
   * @returns {object} 500 - An error message if fetching fails.
   */
  app.get("/api/portfolio/all", async (req, res) => {
    try {
      const category = req.query.category as string;
      const images = await storage.getAllPortfolioImages(category);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all portfolio images" });
    }
  });

  /**
   * @route GET /api/portfolio/categories
   * @description Fetches a list of all unique portfolio categories and the count of items in each.
   * @returns {object} 200 - An array of category objects, each with a `category` name and `count`.
   * @returns {object} 500 - An error message if fetching fails.
   */
  app.get("/api/portfolio/categories", async (req, res) => {
    try {
      const categories = await storage.getPortfolioCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio categories" });
    }
  });

  /**
   * @route POST /api/contact
   * @description Receives and stores a new contact form submission after validation.
   * @body {InsertContactSubmission} The contact form data, conforming to the `insertContactSubmissionSchema`.
   * @returns {object} 200 - A success message and the ID of the new submission.
   * @returns {object} 400 - An error message if the form data is invalid.
   * @returns {object} 500 - An error message if the submission fails.
   */
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

  /**
   * @route GET /api/health
   * @description Provides a simple health check endpoint to verify that the server is running.
   * @returns {object} 200 - An object with the server status and a timestamp.
   */
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  /**
   * @route GET /api/blog/posts
   * @description Fetches all published blog posts.
   * @returns {object} 200 - An array of published blog post objects.
   * @returns {object} 500 - An error message if fetching fails.
   */
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  /**
   * @route GET /api/blog/posts/:slug
   * @description Fetches a single published blog post by its unique slug.
   * @param {string} slug - The slug of the blog post to retrieve.
   * @returns {object} 200 - The requested blog post object.
   * @returns {object} 404 - An error message if the blog post is not found.
   * @returns {object} 500 - An error message if fetching fails.
   */
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

  /**
   * @route GET /api/cv/download
   * @description Provides the URL and filename for downloading the CV.
   * @returns {{url: string, name: string}} 200 - An object containing the URL and name of the CV file.
   */
  app.get("/api/cv/download", (req, res) => {
    // Return CV information
    res.json({ 
      url: "/attached_assets/yadu-krishna-cv.pdf",
      name: "Yadu_Krishna_CV.pdf"
    });
  });

  /**
   * @route GET /api/vimeo/videos
   * @description Fetches a sample list of Vimeo videos. In a production environment, this would fetch from a live API.
   * @returns {object} 200 - An array of sample Vimeo video data.
   * @returns {object} 500 - An error message if fetching fails.
   */
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
