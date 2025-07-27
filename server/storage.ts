import { users, portfolioImages, contactSubmissions, blogPosts, type User, type InsertUser, type PortfolioImage, type InsertPortfolioImage, type ContactSubmission, type InsertContactSubmission, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPortfolioImages(limit?: number, offset?: number): Promise<PortfolioImage[]>;
  getAllPortfolioImages(): Promise<PortfolioImage[]>;
  createPortfolioImage(image: InsertPortfolioImage): Promise<PortfolioImage>;
  
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  
  // Blog methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getPortfolioImages(limit: number = 20, offset: number = 0): Promise<PortfolioImage[]> {
    const images = await db
      .select()
      .from(portfolioImages)
      .limit(limit)
      .offset(offset);
    return images;
  }

  async getAllPortfolioImages(): Promise<PortfolioImage[]> {
    const images = await db.select().from(portfolioImages);
    return images;
  }

  async createPortfolioImage(insertImage: InsertPortfolioImage): Promise<PortfolioImage> {
    const [image] = await db
      .insert(portfolioImages)
      .values(insertImage)
      .returning();
    return image;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  // Blog methods implementation
  async getAllBlogPosts(): Promise<BlogPost[]> {
    const posts = await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
    return posts;
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, 1))
      .orderBy(blogPosts.createdAt);
    return posts;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db
      .update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    return post || undefined;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    try {
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
      return true;
    } catch {
      return false;
    }
  }
}

// Legacy memory storage class for fallback
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private portfolioImages: Map<string, PortfolioImage>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private blogPosts: Map<string, BlogPost>;

  constructor() {
    this.users = new Map();
    this.portfolioImages = new Map();
    this.contactSubmissions = new Map();
    this.blogPosts = new Map();
    
    // Initialize with portfolio data from the design reference
    this.initializePortfolioData();
    this.initializeBlogData();
  }

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
        order: index
      };
      this.portfolioImages.set(id, portfolioImage);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPortfolioImages(limit: number = 20, offset: number = 0): Promise<PortfolioImage[]> {
    const allImages = Array.from(this.portfolioImages.values())
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    return allImages.slice(offset, offset + limit);
  }

  async getAllPortfolioImages(): Promise<PortfolioImage[]> {
    return Array.from(this.portfolioImages.values())
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createPortfolioImage(insertImage: InsertPortfolioImage): Promise<PortfolioImage> {
    const id = randomUUID();
    const image: PortfolioImage = { ...insertImage, id };
    this.portfolioImages.set(id, image);
    return image;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = { 
      ...insertSubmission, 
      id, 
      submittedAt: new Date().toISOString() 
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

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

  // Blog methods implementation
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.published === 1)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.blogPosts.set(id, post);
    return post;
  }

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

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
}

export const storage = new DatabaseStorage();
