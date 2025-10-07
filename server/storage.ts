/**
 * @fileoverview This file provides storage abstractions for the application.
 * It includes a database-backed storage implementation and a legacy in-memory
 * storage class for fallback or testing purposes.
 */
import { users, portfolioImages, contactSubmissions, blogPosts, type User, type InsertUser, type PortfolioImage, type InsertPortfolioImage, type ContactSubmission, type InsertContactSubmission, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

/**
 * @interface IStorage
 * @description Defines the contract for storage operations in the application.
 */
export interface IStorage {
  /**
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<User | undefined>} The user object or undefined if not found.
   */
  getUser(id: string): Promise<User | undefined>;
  /**
   * @param {string} username - The username of the user to retrieve.
   * @returns {Promise<User | undefined>} The user object or undefined if not found.
   */
  getUserByUsername(username: string): Promise<User | undefined>;
  /**
   * @param {InsertUser} user - The user data to insert.
   * @returns {Promise<User>} The newly created user object.
   */
  createUser(user: InsertUser): Promise<User>;
  
  /**
   * @param {number} [limit] - The maximum number of images to return.
   * @param {number} [offset] - The starting offset for pagination.
   * @param {string} [category] - The category to filter images by.
   * @returns {Promise<PortfolioImage[]>} A list of portfolio images.
   */
  getPortfolioImages(limit?: number, offset?: number, category?: string): Promise<PortfolioImage[]>;
  /**
   * @param {string} [category] - The category to filter images by.
   * @returns {Promise<PortfolioImage[]>} A list of all portfolio images.
   */
  getAllPortfolioImages(category?: string): Promise<PortfolioImage[]>;
  /**
   * @returns {Promise<{category: string, count: number}[]>} A list of portfolio categories with their counts.
   */
  getPortfolioCategories(): Promise<{category: string, count: number}[]>;
  /**
   * @param {InsertPortfolioImage} image - The portfolio image data to insert.
   * @returns {Promise<PortfolioImage>} The newly created portfolio image.
   */
  createPortfolioImage(image: InsertPortfolioImage): Promise<PortfolioImage>;
  
  /**
   * @param {InsertContactSubmission} submission - The contact submission data to insert.
   * @returns {Promise<ContactSubmission>} The newly created contact submission.
   */
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  
  /**
   * @returns {Promise<BlogPost[]>} A list of all blog posts.
   */
  getAllBlogPosts(): Promise<BlogPost[]>;
  /**
   * @returns {Promise<BlogPost[]>} A list of all published blog posts.
   */
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  /**
   * @param {string} slug - The slug of the blog post to retrieve.
   * @returns {Promise<BlogPost | undefined>} The blog post object or undefined if not found.
   */
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  /**
   * @param {InsertBlogPost} post - The blog post data to insert.
   * @returns {Promise<BlogPost>} The newly created blog post.
   */
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  /**
   * @param {string} id - The ID of the blog post to update.
   * @param {Partial<InsertBlogPost>} post - The partial blog post data to update.
   * @returns {Promise<BlogPost | undefined>} The updated blog post or undefined if not found.
   */
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  /**
   * @param {string} id - The ID of the blog post to delete.
   * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
   */
  deleteBlogPost(id: string): Promise<boolean>;
}

/**
 * @class DatabaseStorage
 * @description Implements the IStorage interface using a Drizzle ORM database connection.
 * @implements {IStorage}
 */
export class DatabaseStorage implements IStorage {
  /**
   * Retrieves a user by their ID.
   * @param {string} id - The ID of the user.
   * @returns {Promise<User | undefined>} The user, or undefined if not found.
   */
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  /**
   * Retrieves a user by their username.
   * @param {string} username - The username of the user.
   * @returns {Promise<User | undefined>} The user, or undefined if not found.
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  /**
   * Creates a new user.
   * @param {InsertUser} insertUser - The data for the new user.
   * @returns {Promise<User>} The created user.
   */
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  /**
   * Retrieves a paginated list of portfolio images.
   * @param {number} [limit=20] - The number of images to retrieve.
   * @param {number} [offset=0] - The offset to start from.
   * @param {string} [category] - An optional category to filter by.
   * @returns {Promise<PortfolioImage[]>} A list of portfolio images.
   */
  async getPortfolioImages(limit: number = 20, offset: number = 0, category?: string): Promise<PortfolioImage[]> {
    if (category && category !== 'all') {
      const images = await db.select().from(portfolioImages)
        .where(eq(portfolioImages.category, category))
        .limit(limit)
        .offset(offset);
      return images;
    }
    
    const images = await db.select().from(portfolioImages)
      .limit(limit)
      .offset(offset);
    return images;
  }

  /**
   * Retrieves all portfolio images, optionally filtered by category.
   * @param {string} [category] - An optional category to filter by.
   * @returns {Promise<PortfolioImage[]>} A list of all portfolio images.
   */
  async getAllPortfolioImages(category?: string): Promise<PortfolioImage[]> {
    if (category && category !== 'all') {
      const images = await db.select().from(portfolioImages)
        .where(eq(portfolioImages.category, category));
      return images;
    }
    
    const images = await db.select().from(portfolioImages);
    return images;
  }

  /**
   * Retrieves all portfolio categories and the count of images in each.
   * @returns {Promise<{category: string, count: number}[]>} A list of categories and their counts.
   */
  async getPortfolioCategories(): Promise<{category: string, count: number}[]> {
    const result = await db
      .select({
        category: portfolioImages.category,
        count: sql<number>`count(*)`
      })
      .from(portfolioImages)
      .groupBy(portfolioImages.category);
    
    return result.map(r => ({ category: r.category, count: Number(r.count) }));
  }

  /**
   * Creates a new portfolio image entry.
   * @param {InsertPortfolioImage} insertImage - The data for the new image.
   * @returns {Promise<PortfolioImage>} The created portfolio image.
   */
  async createPortfolioImage(insertImage: InsertPortfolioImage): Promise<PortfolioImage> {
    const [image] = await db
      .insert(portfolioImages)
      .values(insertImage)
      .returning();
    return image;
  }

  /**
   * Creates a new contact form submission.
   * @param {InsertContactSubmission} insertSubmission - The data for the submission.
   * @returns {Promise<ContactSubmission>} The created contact submission.
   */
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  /**
   * Retrieves all blog posts.
   * @returns {Promise<BlogPost[]>} A list of all blog posts.
   */
  async getAllBlogPosts(): Promise<BlogPost[]> {
    const posts = await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
    return posts;
  }

  /**
   * Retrieves all published blog posts.
   * @returns {Promise<BlogPost[]>} A list of published blog posts.
   */
  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, 1))
      .orderBy(blogPosts.createdAt);
    return posts;
  }

  /**
   * Retrieves a blog post by its slug.
   * @param {string} slug - The slug of the blog post.
   * @returns {Promise<BlogPost | undefined>} The blog post, or undefined if not found.
   */
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  /**
   * Creates a new blog post.
   * @param {InsertBlogPost} insertPost - The data for the new blog post.
   * @returns {Promise<BlogPost>} The created blog post.
   */
  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  /**
   * Updates an existing blog post.
   * @param {string} id - The ID of the blog post to update.
   * @param {Partial<InsertBlogPost>} updateData - The data to update.
   * @returns {Promise<BlogPost | undefined>} The updated blog post, or undefined if not found.
   */
  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    return post || undefined;
  }

  /**
   * Deletes a blog post.
   * @param {string} id - The ID of the blog post to delete.
   * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
   */
  async deleteBlogPost(id: string): Promise<boolean> {
    try {
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * @class MemStorage
 * @description Legacy in-memory storage class for fallback or testing.
 * @implements {IStorage}
 */
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private portfolioImages: Map<string, PortfolioImage>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private blogPosts: Map<string, BlogPost>;

  /**
   * Creates an instance of MemStorage.
   */
  constructor() {
    this.users = new Map();
    this.portfolioImages = new Map();
    this.contactSubmissions = new Map();
    this.blogPosts = new Map();
    
    // Initialize with portfolio data from the design reference
    this.initializePortfolioData();
    this.initializeBlogData();
  }

  /**
   * Initializes the portfolio data with sample images.
   * @private
   */
  private initializePortfolioData() {
    const portfolioData = [
      {"filename":"PORTFOLIO - 1873.jpeg","imageurl":"https://lh3.googleusercontent.com/d/12f3g8Ra9ioHT9Grptg_LtwMC_K7D0vUc","caption":"Professional portrait in industrial setting"},
      {"filename":"PORTFOLIO - 1746.jpeg","imageurl":"https://lh3.googleusercontent.com/d/16ZL63UuU4z4Dc1LEgrFNMdTgRteVSbbP","caption":"Elegant cafe moment captured"},
      {"filename":"PORTFOLIO - 1535.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1T7YuukIG6iM--i9UHUHM7aQFQ2IMET6e","caption":"Family bonding moment"},
      {"filename":"PORTFOLIO - 2533.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1Ry5eJf6QBIUac6Q0AzJvwtQmIJKfXCXN","caption":"Adventure motorcycle lifestyle"},
      {"filename":"PORTFOLIO - 2531.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1uA86cfEDYa8cGe4ooKh0hfN9wrkfHPP1","caption":"Urban motorcycle culture"},
      {"filename":"PORTFOLIO - 2525.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1bo21jpwj-4_u5rsBooxy0B9WE3UFCXDp","caption":"Festival vibes and ferris wheel"},
      {"filename":"PORTFOLIO - 2518.jpeg","imageurl":"https://lh3.googleusercontent.com/d/17fUwpVJTKzsPNSkld45Akr5CyWZfzy6G","caption":"Nature and machine harmony"},
      {"filename":"PORTFOLIO - 2513.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1GTa_ycRbvs7jEPVPFJ4LtWZfqourn1wR","caption":"Golden hour intimate portrait"},
      {"filename":"PORTFOLIO - 2511.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1v9LaIyONgjV_k2YWjpn6-J5YeLJrdhLh","caption":"Contemplative sunset silhouette"},
      {"filename":"PORTFOLIO - 2506.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1BypiB5bLfrRwy0ApTxx3kU9g5ygu8R8Z","caption":"Dynamic motorcycle action"},
      {"filename":"PORTFOLIO - 2503.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1FuiW8qs1K60DN6AEd3OdZ7f5T65JH6aM","caption":"Street photography essence"},
      {"filename":"PORTFOLIO - 2498.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1KO90KueDG_HQ1BjoFIWBXsgPrV_3Dv2t","caption":"Urban architectural portrait"},
      {"filename":"PORTFOLIO - 2497.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1QMfBxip-ZE7IC43ZYGXbgIEtw6mGcu1J","caption":"Candid moment captured"},
      {"filename":"PORTFOLIO - 2496.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1AnsbcQsK1SKTiExdBBheNCRvYWwVEfPN","caption":"Celebration and sparkles"},
      {"filename":"PORTFOLIO - 2493.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1GoT7rp-RWZURiAoYyVtRx8WYflsCIFOZ","caption":"Colorful artistic expression"},
      {"filename":"PORTFOLIO - 2492.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1r75NxdxaRExHul4J-IKIZ69IwSdCgCoe","caption":"Holi festival portrait"},
      {"filename":"PORTFOLIO - 2491.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1-R1Kiztft4aCZaoTzgDq-kDYqzPbjt9H","caption":"Cultural celebration artwork"},
      {"filename":"PORTFOLIO - 2486.jpeg","imageurl":"https://lh3.googleusercontent.com/d/14et5tYegHPvL2MxT5E-xiRCj-H97Mot7","caption":"Spiritual moment in darkness"},
      {"filename":"PORTFOLIO - 2470.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1rl-fxsDwpKn20b99LJ_fd0l9_8OlGO0R","caption":"Urban skateboard lifestyle"},
      {"filename":"PORTFOLIO - 2471.jpeg","imageurl":"https://lh3.googleusercontent.com/d/1vrfYhUV8xcG5VD905wihIoMSk_zNIpUs","caption":"Rain and street culture"},
      // Expanding the dataset with variations for a richer portfolio
      {"filename":"PORTFOLIO - 3001.jpeg","imageurl":"https://picsum.photos/800/1200?random=1","caption":"Creative studio lighting"},
      {"filename":"PORTFOLIO - 3002.jpeg","imageurl":"https://picsum.photos/600/800?random=2","caption":"Environmental portrait session"},
      {"filename":"PORTFOLIO - 3003.jpeg","imageurl":"https://picsum.photos/900/600?random=3","caption":"Landscape photography exploration"},
      {"filename":"PORTFOLIO - 3004.jpeg","imageurl":"https://picsum.photos/700/1000?random=4","caption":"Fashion editorial shoot"},
      {"filename":"PORTFOLIO - 3005.jpeg","imageurl":"https://picsum.photos/800/800?random=5","caption":"Product photography excellence"},
      {"filename":"PORTFOLIO - 3006.jpeg","imageurl":"https://picsum.photos/600/900?random=6","caption":"Street art documentation"},
      {"filename":"PORTFOLIO - 3007.jpeg","imageurl":"https://picsum.photos/1000/700?random=7","caption":"Event photography mastery"},
      {"filename":"PORTFOLIO - 3008.jpeg","imageurl":"https://picsum.photos/750/950?random=8","caption":"Architectural detail focus"},
      {"filename":"PORTFOLIO - 3009.jpeg","imageurl":"https://picsum.photos/850/650?random=9","caption":"Night photography techniques"},
      {"filename":"PORTFOLIO - 3010.jpeg","imageurl":"https://picsum.photos/650/850?random=10","caption":"Wildlife and nature capture"}
    ];

    portfolioData.forEach((item, index) => {
      const id = randomUUID();
      const portfolioImage: PortfolioImage = {
        id,
        filename: item.filename,
        imageurl: item.imageurl,
        caption: item.caption,
        order: index,
        type: "image",
        videoId: null,
        category: "photography",
        tags: []
      };
      this.portfolioImages.set(id, portfolioImage);
    });
  }

  /**
   * Retrieves a user by their ID from memory.
   * @param {string} id - The ID of the user.
   * @returns {Promise<User | undefined>} The user, or undefined if not found.
   */
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  /**
   * Retrieves a user by their username from memory.
   * @param {string} username - The username of the user.
   * @returns {Promise<User | undefined>} The user, or undefined if not found.
   */
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  /**
   * Creates a new user in memory.
   * @param {InsertUser} insertUser - The data for the new user.
   * @returns {Promise<User>} The created user.
   */
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  /**
   * Retrieves a paginated list of portfolio images from memory.
   * @param {number} [limit=20] - The number of images to retrieve.
   * @param {number} [offset=0] - The offset to start from.
   * @returns {Promise<PortfolioImage[]>} A list of portfolio images.
   */
  async getPortfolioImages(limit: number = 20, offset: number = 0): Promise<PortfolioImage[]> {
    const allImages = Array.from(this.portfolioImages.values())
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    return allImages.slice(offset, offset + limit);
  }

  /**
   * Retrieves all portfolio images from memory.
   * @returns {Promise<PortfolioImage[]>} A list of all portfolio images.
   */
  async getAllPortfolioImages(): Promise<PortfolioImage[]> {
    return Array.from(this.portfolioImages.values())
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * Retrieves all portfolio categories and their counts from memory.
   * @returns {Promise<{category: string, count: number}[]>} A list of categories and their counts.
   */
  async getPortfolioCategories(): Promise<{category: string, count: number}[]> {
    const categoryMap = new Map<string, number>();
    Array.from(this.portfolioImages.values()).forEach(image => {
      const count = categoryMap.get(image.category) || 0;
      categoryMap.set(image.category, count + 1);
    });
    return Array.from(categoryMap.entries()).map(([category, count]) => ({ category, count }));
  }

  /**
   * Creates a new portfolio image in memory.
   * @param {InsertPortfolioImage} insertImage - The data for the new image.
   * @returns {Promise<PortfolioImage>} The created portfolio image.
   */
  async createPortfolioImage(insertImage: InsertPortfolioImage): Promise<PortfolioImage> {
    const id = randomUUID();
    const image: PortfolioImage = { 
      ...insertImage, 
      id,
      type: insertImage.type || "image",
      videoId: insertImage.videoId || null,
      category: insertImage.category || "photography",
      tags: insertImage.tags || [],
      order: insertImage.order || 0
    };
    this.portfolioImages.set(id, image);
    return image;
  }

  /**
   * Creates a new contact form submission in memory.
   * @param {InsertContactSubmission} insertSubmission - The data for the submission.
   * @returns {Promise<ContactSubmission>} The created contact submission.
   */
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id,
      subject: insertSubmission.subject || null,
      submittedAt: new Date().toISOString() 
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  /**
   * Initializes the blog data with sample posts.
   * @private
   */
  private initializeBlogData() {
    const samplePosts: BlogPost[] = [
      {
        id: randomUUID(),
        title: "The Art of Visual Storytelling",
        slug: "art-of-visual-storytelling",
        excerpt: "Exploring how photography transcends mere documentation to become a powerful narrative medium.",
        content: "Photography is more than capturing moments; it's about weaving stories that resonate with viewers...",
        coverImage: "https://picsum.photos/1200/600?random=20",
        category: "Photography",
        tags: ["storytelling", "photography", "creativity"],
        author: "Yadu Krishna",
        published: 1,
        readTime: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        title: "Behind the Lens: Wedding Photography",
        slug: "behind-lens-wedding-photography",
        excerpt: "A deep dive into capturing the most precious moments of a couple's special day.",
        content: "Wedding photography is about anticipating emotions and preserving memories...",
        coverImage: "https://picsum.photos/1200/600?random=21",
        category: "Wedding",
        tags: ["wedding", "photography", "tips"],
        author: "Yadu Krishna",
        published: 1,
        readTime: 7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    samplePosts.forEach(post => {
      this.blogPosts.set(post.id, post);
    });
  }

  /**
   * Retrieves all blog posts from memory.
   * @returns {Promise<BlogPost[]>} A list of all blog posts.
   */
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  }

  /**
   * Retrieves all published blog posts from memory.
   * @returns {Promise<BlogPost[]>} A list of published blog posts.
   */
  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.published === 1)
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
  }

  /**
   * Retrieves a blog post by its slug from memory.
   * @param {string} slug - The slug of the blog post.
   * @returns {Promise<BlogPost | undefined>} The blog post, or undefined if not found.
   */
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  /**
   * Creates a new blog post in memory.
   * @param {InsertBlogPost} insertPost - The data for the new blog post.
   * @returns {Promise<BlogPost>} The created blog post.
   */
  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      tags: insertPost.tags || [],
      author: insertPost.author || "Yadu Krishna",
      published: insertPost.published || 0,
      readTime: insertPost.readTime || 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.blogPosts.set(id, post);
    return post;
  }

  /**
   * Updates an existing blog post in memory.
   * @param {string} id - The ID of the blog post to update.
   * @param {Partial<InsertBlogPost>} updateData - The data to update.
   * @returns {Promise<BlogPost | undefined>} The updated blog post, or undefined if not found.
   */
  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const updated: BlogPost = {
      ...post,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  /**
   * Deletes a blog post from memory.
   * @param {string} id - The ID of the blog post to delete.
   * @returns {Promise<boolean>} True if the deletion was successful.
   */
  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
}

/**
 * The singleton instance of the DatabaseStorage.
 * @type {IStorage}
 */
export const storage = new DatabaseStorage();
