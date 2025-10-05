// src/pages/blog/BlogPost.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ChevronLeft, Clock, Tag, List } from 'lucide-react';

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-matrix-green"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-24 px-4">
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

  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // Update document metadata
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | CryptoWebb Blog`;
      
      // Helper function to set or update meta tags
      const setMetaTag = (name: string, content: string, property?: boolean) => {
        const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        let meta = document.querySelector(selector) as HTMLMetaElement;
        
        if (!meta) {
          meta = document.createElement('meta');
          if (property) {
            meta.setAttribute('property', name);
          } else {
            meta.setAttribute('name', name);
          }
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      setMetaTag('description', post.meta_desc);
      setMetaTag('og:title', post.title, true);
      setMetaTag('og:description', post.meta_desc, true);
      if (post.image_url) setMetaTag('og:image', post.image_url, true);
      setMetaTag('og:type', 'article', true);
      setMetaTag('article:published_time', post.created_at, true);
      
      // Remove existing article tags first
      const existingTags = document.querySelectorAll('meta[property="article:tag"]');
      existingTags.forEach(tag => tag.remove());
      
      // Add new article tags
      post.tags.forEach(tag => {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'article:tag');
        meta.setAttribute('content', tag);
        document.head.appendChild(meta);
      });
    }
  }, [post]);

  return (
    <>

      <div className="min-h-screen pt-24 px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Image Section */}
          {post.image_url && (
            <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
              <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-5xl font-mono text-white mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {formattedDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={16} />
                    {post.tags.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-row-reverse gap-8">
            {/* Table of Contents - Now on the right */}
            {tableOfContents.length > 0 && (
              <div className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24">
                  <Card className="bg-black/90 border border-matrix-green p-4">
                    <div className="flex items-center gap-2 mb-4 text-matrix-green font-mono">
                      <List size={16} />
                      Contents
                    </div>
                    <nav className="space-y-1">
                      {tableOfContents.map(({ id, title, level }) => (
                        <a
                          key={id}
                          href={`#${id}`}
                          className={`block text-sm ${level > 1 ? 'pl-' + (level - 1) * 2 : ''} ${
                            activeSection === id
                              ? 'text-matrix-green'
                              : 'text-gray-400 hover:text-matrix-green/80'
                          } transition-colors duration-200 py-1`}
                        >
                          {title}
                        </a>
                      ))}
                    </nav>
                  </Card>
                </div>
              </div>
            )}

            {/* Main Content - Now on the left */}
            <Card className="flex-1 bg-black/90 border border-matrix-green p-8">
              {!post.image_url && (
                <>
                  <h1 className="text-4xl font-mono text-matrix-green mb-4">{post.title}</h1>
                  <div className="flex items-center gap-4 text-gray-400 mb-8">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {formattedDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag size={16} />
                      {post.tags.join(', ')}
                    </div>
                  </div>
                </>
              )}

              {user?.role === 'admin' && (
                <div className="flex justify-end mb-6">
                  <Link to={`/dashboard/blog/edit/${post.id}`}>
                    <Button className="bg-matrix-green hover:bg-matrix-green/80 text-black font-mono">
                      Edit Post
                    </Button>
                  </Link>
                </div>
              )}

              <article className="prose prose-invert prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  className="text-gray-300"
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        id={props.children
                          ?.toString()
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')}
                        className="text-matrix-green font-mono text-3xl mt-8 mb-4"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        id={props.children
                          ?.toString()
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')}
                        className="text-matrix-green font-mono text-2xl mt-6 mb-3"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        id={props.children
                          ?.toString()
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')}
                        className="text-matrix-green font-mono text-xl mt-4 mb-2"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => <p className="text-gray-300 mb-4" {...props} />,
                    a: ({ node, ...props }) => (
                      <a
                        className="text-matrix-green hover:text-matrix-green/80 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc list-inside mb-4 text-gray-300" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal list-inside mb-4 text-gray-300" {...props} />
                    ),
                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-matrix-green pl-4 my-4 italic text-gray-400"
                        {...props}
                      />
                    ),
                    code: ({ node, inline, className, children, ...props }: CodeProps) => {
                      if (inline) {
                        return (
                          <code
                            className="bg-black/50 text-matrix-green px-1 rounded font-mono"
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      }
                      return (
                        <div className="w-full overflow-x-auto bg-black/50 rounded-lg border border-matrix-green/30">
                          <code className="block text-matrix-green p-4 font-mono" {...props}>
                            {children}
                          </code>
                        </div>
                      );
                    },
                    pre: ({ node, ...props }) => (
                      <pre
                        className="w-full overflow-x-auto bg-black/50 border border-matrix-green p-4 rounded-lg mb-4"
                        {...props}
                      />
                    ),
                    img: ({ node, ...props }) => (
                      <img
                        className="max-w-full h-auto rounded-lg border border-matrix-green/50"
                        {...props}
                      />
                    ),
                    hr: ({ node, ...props }) => (
                      <hr className="border-matrix-green/30 my-8" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-matrix-green/30" {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="border border-matrix-green/30 p-2 bg-matrix-green/10 text-matrix-green font-mono"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="border border-matrix-green/30 p-2 text-gray-300" {...props} />
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </article>

              {/* Tags */}
              <div className="mt-8 pt-8 border-t border-matrix-green/30">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded text-sm font-mono bg-matrix-green/20 text-matrix-green"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-12 pt-8 border-t border-matrix-green/30">
                  <h2 className="text-2xl font-mono text-matrix-green mb-6">Related Posts</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="group">
                        <Card className="h-full bg-black/50 border border-matrix-green/50 hover:border-matrix-green transition-colors duration-200">
                          {relatedPost.image_url && (
                            <div className="h-48 overflow-hidden">
                              <img
                                src={relatedPost.image_url}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="text-lg font-mono text-matrix-green mb-2">
                              {relatedPost.title}
                            </h3>
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {relatedPost.meta_desc}
                            </p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-12 pt-8 border-t border-matrix-green/30 flex justify-between items-center">
                <Link
                  to="/blog"
                  className="flex items-center gap-2 text-matrix-green hover:text-matrix-green/80 font-mono group"
                >
                  <ChevronLeft className="transition-transform group-hover:-translate-x-1" />
                  Back to blog list
                </Link>
                <div className="flex gap-4">
                  {user?.role === 'admin' && (
                    <Link to={`/dashboard/blog/edit/${post.id}`}>
                      <Button
                        variant="outline"
                        className="border-matrix-green text-matrix-green hover:bg-matrix-green/20"
                      >
                        Edit Post
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default BlogPost;
