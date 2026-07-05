// src/pages/blog/BlogList.tsx
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, PenSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';

import type { BlogPost, BlogListResponse } from '@/types/api';

// Strip markdown syntax for a plain-text preview.
const getContentPreview = (content: string) => {
  const cleanText = content
    .replace(/#{1,6} /g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`/g, '')
    .split('\n\n')[0]
    .trim();

  return cleanText.length > 150 ? cleanText.substring(0, 150) + '...' : cleanText;
};

const BlogCard = ({ post, index }: { post: BlogPost; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: (index % 3) * 0.06 }}
    className="group rounded-xl border border-border bg-surface overflow-hidden transition-colors hover:border-primary/30 flex flex-col"
  >
    {post.image_url && (
      <Link to={`/blog/${post.slug}`} className="block relative h-44 overflow-hidden" tabIndex={-1}>
        <img
          src={post.image_url}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
    )}
    <div className="p-6 flex flex-col flex-1">
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">
              {tag}
            </span>
          ))}
        </div>
      )}

      <Link to={`/blog/${post.slug}`} className="block">
        <h2 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
          {post.title}
        </h2>
      </Link>
      <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-3">
        {getContentPreview(post.content)}
      </p>

      <div className="mt-auto pt-4 flex items-center justify-between border-t border-border mt-4">
        <time className="text-xs text-text-secondary" dateTime={post.created_at}>
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Read more
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  </motion.article>
);

export default function BlogList() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery<BlogListResponse>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await axios.get<BlogListResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog`
      );
      return response.data;
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
      <div className="flex items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Blog</h1>
          <p className="mt-2 text-text-secondary">
            Product updates, on-chain research, and engineering notes.
          </p>
        </div>
        {user?.role === 'admin' && (
          <Link to="/settings/blog/new">
            <Button variant="primary">
              <PenSquare className="w-4 h-4 mr-2" aria-hidden="true" />
              New post
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface overflow-hidden">
              <Skeleton className="h-44 w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : !data?.posts?.length ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-text-secondary">No posts published yet — check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
