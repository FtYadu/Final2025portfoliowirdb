/**
 * @fileoverview This file defines the Blog page component, which displays a
 * collection of blog posts with filtering capabilities.
 */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NavMenu } from "@/components/nav-menu";
import { SpiralSocialDock } from "@/components/spiral-social-dock";
import { Calendar, User, ArrowRight, Clock, Filter, Tag } from "lucide-react";
import { Link } from "wouter";
import type { BlogPost } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * The Blog page component.
 * It fetches blog posts from an API and displays them in a grid.
 * Users can filter the posts by category and tags.
 *
 * @returns {JSX.Element} The rendered blog page.
 */
export default function Blog() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts']
  });

  // Extract unique categories and tags
  const categories = ["all", ...Array.from(new Set(posts.map(post => post.category)))];
  const allTags = posts.flatMap(post => post.tags);
  const uniqueTags = ["all", ...Array.from(new Set(allTags))];

  // Filter posts based on selected category and tag
  const filteredPosts = posts.filter(post => {
    const categoryMatch = selectedCategory === "all" || post.category === selectedCategory;
    const tagMatch = selectedTag === "all" || post.tags.includes(selectedTag);
    return categoryMatch && tagMatch;
  });

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

        {/* Filter Section */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      Category: {selectedCategory}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categories.map(category => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tag: {selectedTag}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {uniqueTags.map(tag => (
                      <DropdownMenuItem
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="text-muted-foreground">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-800 rounded-lg mb-6" />
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded" />
                      <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">No blog posts found.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.id}>
                    <article className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-2">
                      <div className="aspect-[16/9] overflow-hidden rounded-lg mb-6">
                        <img 
                          src={post.coverImage} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime} min read
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          {post.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                        
                        <h2 className="text-2xl font-bold group-hover:text-accent-purple transition-colors">
                          {post.title}
                        </h2>
                        
                        <p className="text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4">
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1 text-accent-purple group-hover:gap-2 transition-all">
                            Read More <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}