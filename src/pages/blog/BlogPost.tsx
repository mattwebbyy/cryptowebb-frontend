// src/pages/blog/BlogPost.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, Clock, Tag, List } from 'lucide-react';

import type { BlogPost } from '@/types/api';

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface CodeProps {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const headingId = (children: React.ReactNode) =>
  children
    ?.toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');

  // Fetch main blog post
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const response = await axios.get<BlogPost>(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${slug}`
      );
      return response.data;
    },
    enabled: !!slug,
  });

  // Fetch related posts
  const { data: relatedPosts = [] } = useQuery<BlogPost[]>({
    queryKey: ['related-blogs', post?.id, post?.tags],
    queryFn: async () => {
      if (!post?.id || !post?.tags.length) return [];
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/related`, {
        params: {
          tags: post.tags.join(','),
          postId: post.id,
        },
      });
      return response.data.posts || [];
    },
    enabled: !!post?.id && !!post?.tags.length,
  });

  // Generate table of contents from markdown content
  useEffect(() => {
    if (post?.content) {
      const headers: TableOfContentsItem[] = [];
      const lines = post.content.split('\n');

      lines.forEach((line) => {
        const match = line.match(/^(#{1,3})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const title = match[2];
          const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          headers.push({ id, title, level });
        }
      });

      setTableOfContents(headers);
    }
  }, [post?.content]);

  // Intersection Observer for active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    tableOfContents.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tableOfContents]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div
          className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent"
          role="status"
          aria-label="Loading post"
        />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="rounded-xl border border-border bg-surface p-10 text-center max-w-md">
          <h2 className="text-xl font-semibold tracking-tight">Post not found</h2>
          <p className="mt-2 text-text-secondary">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">
            ← Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Helmet>
        <title>{post.title} | CryptoWebb Blog</title>
        <meta name="description" content={post.meta_desc} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_desc} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.created_at} />
        {post.tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <div className="min-h-screen pt-24 px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          {/* Hero Image Section */}
          {post.image_url && (
            <div className="relative w-full h-[360px] mb-10 rounded-2xl overflow-hidden border border-border">
              <img src={post.image_url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <div className="flex items-center gap-2">
                    <Clock size={14} aria-hidden="true" />
                    {formattedDate}
                  </div>
                  {post.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag size={14} aria-hidden="true" />
                      {post.tags.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-row-reverse gap-8">
            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
              <div className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24">
                  <nav
                    aria-label="Table of contents"
                    className="rounded-xl border border-border bg-surface p-4"
                  >
                    <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                      <List size={14} aria-hidden="true" />
                      On this page
                    </div>
                    <div className="space-y-0.5">
                      {tableOfContents.map(({ id, title, level }) => (
                        <a
                          key={id}
                          href={`#${id}`}
                          className={`block text-sm py-1 transition-colors ${
                            level > 1 ? `pl-${(level - 1) * 2}` : ''
                          } ${
                            activeSection === id
                              ? 'text-primary'
                              : 'text-text-secondary hover:text-text'
                          }`}
                        >
                          {title}
                        </a>
                      ))}
                    </div>
                  </nav>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0 rounded-2xl border border-border bg-surface p-6 md:p-10">
              {!post.image_url && (
                <>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-text-secondary mb-8">
                    <div className="flex items-center gap-2">
                      <Clock size={14} aria-hidden="true" />
                      {formattedDate}
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag size={14} aria-hidden="true" />
                        {post.tags.join(', ')}
                      </div>
                    )}
                  </div>
                </>
              )}

              {user?.role === 'admin' && (
                <div className="flex justify-end mb-6">
                  <Link to={`/settings/blog/edit/${post.id}`}>
                    <Button variant="outline" size="sm">
                      Edit post
                    </Button>
                  </Link>
                </div>
              )}

              <article className="max-w-none">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        id={headingId(props.children)}
                        className="text-2xl md:text-3xl font-bold tracking-tight mt-10 mb-4 scroll-mt-24"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        id={headingId(props.children)}
                        className="text-xl md:text-2xl font-bold tracking-tight mt-8 mb-3 scroll-mt-24"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        id={headingId(props.children)}
                        className="text-lg md:text-xl font-semibold tracking-tight mt-6 mb-2 scroll-mt-24"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-text-secondary leading-relaxed mb-4" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc pl-6 mb-4 text-text-secondary space-y-1"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal pl-6 mb-4 text-text-secondary space-y-1"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-2 border-primary pl-4 my-4 italic text-text-secondary"
                        {...props}
                      />
                    ),
                    code: ({ node, inline, className, children, ...props }: CodeProps) => {
                      if (inline) {
                        return (
                          <code
                            className="bg-surface-2 text-primary px-1.5 py-0.5 rounded text-[0.9em] font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <div className="w-full overflow-x-auto bg-surface-2 rounded-lg border border-border my-4">
                          <code className="block p-4 font-mono text-sm" {...props}>
                            {children}
                          </code>
                        </div>
                      );
                    },
                    pre: ({ node, ...props }) => (
                      <pre
                        className="w-full overflow-x-auto bg-surface-2 border border-border p-0 rounded-lg mb-4 [&>div]:my-0 [&>div]:border-0"
                        {...props}
                      />
                    ),
                    img: ({ node, ...props }) => (
                      <img
                        className="max-w-full h-auto rounded-lg border border-border"
                        loading="lazy"
                        {...props}
                      />
                    ),
                    hr: ({ node, ...props }) => <hr className="border-border my-8" {...props} />,
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-border text-sm" {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="border border-border p-2 bg-surface-2 font-semibold text-left"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border border-border p-2 text-text-secondary" {...props} />
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </article>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border">
                  <h2 className="text-xl font-semibold tracking-tight mb-6">Related posts</h2>
                  <div className="grid md:grid-cols-3 gap-5">
                    {relatedPosts.map((relatedPost) => (
                      <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="group">
                        <div className="h-full rounded-xl border border-border bg-surface-2 overflow-hidden transition-colors hover:border-primary/30">
                          {relatedPost.image_url && (
                            <div className="h-36 overflow-hidden">
                              <img
                                src={relatedPost.image_url}
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                              {relatedPost.title}
                            </h3>
                            <p className="mt-1 text-xs text-text-secondary line-clamp-2">
                              {relatedPost.meta_desc}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-12 pt-6 border-t border-border flex justify-between items-center">
                <Link
                  to="/blog"
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline group"
                >
                  <ChevronLeft
                    className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  />
                  Back to blog
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default BlogPost;
