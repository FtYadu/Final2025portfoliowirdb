import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavMenu } from "@/components/nav-menu";
import { SpiralSocialDock } from "@/components/spiral-social-dock";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { PortfolioImage } from "@shared/schema";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  coverImage?: string;
  readTime: string;
}

// Mock blog data for now
const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Art of Visual Storytelling",
    excerpt: "Exploring how photography can capture emotions and tell compelling stories without words. A journey through my creative process.",
    date: "2024-01-15",
    author: "Yadu Krishna",
    readTime: "5 min read"
  },
  {
    id: "2", 
    title: "Mastering Natural Light Photography",
    excerpt: "Tips and techniques for capturing stunning portraits using only natural light. Learn how to work with different lighting conditions.",
    date: "2024-01-10",
    author: "Yadu Krishna",
    readTime: "8 min read"
  },
  {
    id: "3",
    title: "Behind the Lens: My Creative Journey",
    excerpt: "From amateur to professional photographer - sharing my experiences, challenges, and breakthroughs in the world of visual arts.",
    date: "2024-01-05",
    author: "Yadu Krishna",
    readTime: "10 min read"
  }
];

export default function Blog() {
  const [isScrolling, setIsScrolling] = useState(false);
  const { data: images = [] } = useQuery<PortfolioImage[]>({
    queryKey: ['/api/portfolio/all']
  });

  // Assign random portfolio images to blog posts
  const blogPostsWithImages = mockBlogPosts.map((post, index) => ({
    ...post,
    coverImage: images[Math.floor(Math.random() * images.length)]?.imageurl
  }));

  return (
    <>
      <NavMenu isScrolling={isScrolling} onToggleScroll={() => setIsScrolling(!isScrolling)} />
      <SpiralSocialDock />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-gray-900 dark:via-gray-800 dark:to-black">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-wider mb-6 text-white">
              BLOG
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-light italic">
              Thoughts, stories, and insights from behind the lens
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPostsWithImages.map((post) => (
                <article 
                  key={post.id}
                  className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2"
                >
                  {post.coverImage && (
                    <div className="aspect-[16/9] overflow-hidden rounded-lg mb-6">
                      <img 
                        src={post.coverImage} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold group-hover:text-accent-purple transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-sm text-muted-foreground">{post.readTime}</span>
                      <span className="flex items-center gap-1 text-accent-purple group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}