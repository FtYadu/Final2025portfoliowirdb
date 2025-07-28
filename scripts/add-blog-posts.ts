import { db } from '../server/db.js';
import { blogPosts } from '../shared/schema.js';

async function addBlogPosts() {
  try {
    console.log('Adding sample blog posts...');
    
    const samplePosts = [
      {
        title: "The Art of Visual Storytelling",
        slug: "art-of-visual-storytelling",
        excerpt: "Exploring how photography and videography can tell compelling stories that resonate with audiences.",
        content: "Visual storytelling is more than just capturing beautiful images. It's about creating a narrative that connects with your audience on an emotional level. In this post, I'll share my insights on how to craft compelling visual stories through photography and videography.",
        coverImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
        category: "Photography",
        tags: ["storytelling", "photography", "creative"],
        published: 1,
        readTime: 8
      },
      {
        title: "Behind the Scenes: Commercial Photography",
        slug: "behind-scenes-commercial-photography",
        excerpt: "A deep dive into the process and techniques used in professional commercial photography shoots.",
        content: "Commercial photography requires a unique blend of technical skill and creative vision. From pre-production planning to post-processing, every step is crucial for delivering high-quality results that meet client expectations.",
        coverImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",
        category: "Commercial",
        tags: ["commercial", "photography", "business"],
        published: 1,
        readTime: 6
      },
      {
        title: "Mastering Portrait Photography",
        slug: "mastering-portrait-photography",
        excerpt: "Tips and techniques for creating stunning portrait photographs that capture personality and emotion.",
        content: "Portrait photography is all about capturing the essence of a person. It requires understanding lighting, composition, and most importantly, how to make your subject feel comfortable and confident.",
        coverImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800",
        category: "Portrait",
        tags: ["portrait", "photography", "lighting"],
        published: 1,
        readTime: 10
      }
    ];
    
    for (const post of samplePosts) {
      await db.insert(blogPosts).values(post);
      console.log(`Added blog post: ${post.title}`);
    }
    
    console.log('Blog posts added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding blog posts:', error);
    process.exit(1);
  }
}

addBlogPosts();