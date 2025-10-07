/**
 * @fileoverview This file defines the database schema for the application using Drizzle ORM.
 * It includes table definitions for portfolio images, contact submissions, users, and blog posts.
 * It also creates and exports Zod schemas for data validation and TypeScript types for type safety.
 */
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * @description Schema for the portfolio images table.
 */
export const portfolioImages = pgTable("portfolio_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  imageurl: text("imageurl").notNull(),
  caption: text("caption").notNull(),
  order: integer("order").default(0),
  type: text("type").notNull().default("image"), // 'image' or 'video'
  videoId: text("video_id"), // For Vimeo videos
  category: text("category").notNull().default("photography"), // photography, portrait, landscape, commercial, personal
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`), // searchable tags
});

/**
 * @description Schema for the contact form submissions table.
 */
export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  submittedAt: varchar("submitted_at").default(sql`now()`),
});

/**
 * @description Schema for the users table.
 */
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

/**
 * @description Zod schema for inserting a new portfolio image.
 */
export const insertPortfolioImageSchema = createInsertSchema(portfolioImages).omit({
  id: true,
});

/**
 * @description Zod schema for inserting a new contact submission.
 */
export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  submittedAt: true,
});

/**
 * @description Zod schema for inserting a new user.
 */
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

/**
 * @description TypeScript type for inserting a new portfolio image.
 */
export type InsertPortfolioImage = z.infer<typeof insertPortfolioImageSchema>;
/**
 * @description TypeScript type for a portfolio image record.
 */
export type PortfolioImage = typeof portfolioImages.$inferSelect;

/**
 * @description TypeScript type for inserting a new contact submission.
 */
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
/**
 * @description TypeScript type for a contact submission record.
 */
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

/**
 * @description TypeScript type for inserting a new user.
 */
export type InsertUser = z.infer<typeof insertUserSchema>;
/**
 * @description TypeScript type for a user record.
 */
export type User = typeof users.$inferSelect;

/**
 * @description Schema for the blog posts table.
 */
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").unique().notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  author: text("author").notNull().default("Yadu Krishna"),
  published: integer("published").notNull().default(0), // 0 = draft, 1 = published
  readTime: integer("read_time").notNull().default(5),
  createdAt: varchar("created_at").default(sql`now()`),
  updatedAt: varchar("updated_at").default(sql`now()`),
});

/**
 * @description Zod schema for inserting a new blog post.
 */
export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * @description TypeScript type for a blog post record.
 */
export type BlogPost = typeof blogPosts.$inferSelect;
/**
 * @description TypeScript type for inserting a new blog post.
 */
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
