// src/pages/blog/BlogList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  tags: string[];
  meta_desc: string;
  is_published: boolean;
  created_at: string;
  author_id: string;
}

interface BlogResponse {
  posts: BlogPost[];
  total: number;
}

export default function BlogList() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery<BlogResponse>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await axios.get<BlogResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog`
      );
      return response.data;
    },
  });

  // Helper function to get clean preview text
  const getContentPreview = (content: string) => {
    // Remove markdown symbols and get first paragraph
    const cleanText = content
      .replace(/#{1,6} /g, '') // Remove headers
      .replace(/\*\*/g, '') // Remove bold
      .replace(/\*/g, '') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with just text
      .replace(/`/g, '') // Remove code ticks
      .split('\n\n')[0] // Get first paragraph
      .trim();

    return cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : cleanText;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-matrix-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-7xl mx-auto bg-black/90 border border-matrix-green p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-mono text-matrix-green">Blog Posts</h1>
            {user?.role === 'admin' && (
              <Link to="/dashboard/blog/new">
                <Button className="bg-matrix-green hover:bg-matrix-green/80 text-black font-mono">
                  Create New Post
                </Button>
              </Link>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data?.posts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="group bg-black/50 border border-matrix-green rounded-lg overflow-hidden hover:border-matrix-green transition-colors duration-300"
              >
                {post.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs font-mono bg-matrix-green/20 text-matrix-green rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="block group-hover:transform group-hover:-translate-y-1 transition-transform duration-300"
                  >
                    <h2 className="text-xl font-mono text-matrix-green mb-3 group-hover:text-matrix-green/80">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                      {getContentPreview(post.content)}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-matrix-green/20">
                    <div className="text-sm text-matrix-green/60 font-mono">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-matrix-green hover:text-matrix-green/80 font-mono text-sm group"
                    >
                      Read more
                      <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
