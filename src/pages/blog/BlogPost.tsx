// src/pages/blog/BlogPost.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const response = await axios.get<BlogPost>(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${slug}`);
      return response.data;
    },
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-matrix-green"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <Card className="max-w-4xl mx-auto bg-black/90 border border-matrix-green p-6">
          <div className="text-center">
            <h2 className="text-2xl font-mono text-matrix-green">Post not found</h2>
            <p className="mt-2 text-gray-400">The blog post you're looking for doesn't exist.</p>
            <Link 
              to="/blog" 
              className="mt-4 inline-block text-matrix-green hover:text-matrix-green/80 font-mono"
            >
              ← Return to blog list
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-4xl mx-auto bg-black/90 border border-matrix-green p-6">
          {user?.role === 'admin' && (
            <div className="flex justify-end mb-6">
              <Link to={`/dashboard/blog/edit/${post.id}`}>
                <Button className="bg-matrix-green hover:bg-matrix-green/80 text-black font-mono">
                  Edit Post
                </Button>
              </Link>
            </div>
          )}

          {post.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden border border-matrix-green/50">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}

          <h1 className="text-4xl font-mono text-matrix-green mb-4">{post.title}</h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 rounded text-sm font-mono bg-matrix-green/20 text-matrix-green"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="text-sm text-matrix-green/60 font-mono mb-8">
            Published on{' '}
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          <div className="prose prose-lg max-w-none prose-invert prose-p:text-gray-300 prose-headings:text-matrix-green prose-headings:font-mono">
            {post.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 border-t border-matrix-green/30 pt-8">
            <Link 
              to="/blog" 
              className="text-matrix-green hover:text-matrix-green/80 font-mono"
            >
              ← Back to all posts
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}