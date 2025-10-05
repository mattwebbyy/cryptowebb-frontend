// src/pages/blog/EnhancedBlogList.tsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { EnhancedSEO } from '@/components/EnhancedSEO';
import { MatrixLoader } from '@/components/ui/MatrixLoader';
import { 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  User, 
  Clock,
  ArrowRight,
  Grid3X3,
  List,
  Sparkles
} from 'lucide-react';

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
  updated_at: string;
  author_id: string;
  author_name?: string;
  read_time?: number;
  featured?: boolean;
}

interface BlogResponse {
  posts: BlogPost[];
  total: number;
  totalPages: number;
  currentPage: number;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'oldest' | 'popular' | 'updated';

export default function EnhancedBlogList() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading, error } = useQuery<BlogResponse>({
    queryKey: ['blogs', currentPage, searchTerm, selectedTag, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedTag && { tag: selectedTag }),
        sort: sortBy,
      });

      const response = await axios.get<BlogResponse>(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog?${params}`
      );
      return response.data;
    },
  });

  // Get all unique tags for filtering
  const allTags = useMemo(() => {
    if (!data?.posts) return [];
    const tagSet = new Set<string>();
    data.posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [data?.posts]);

  // Filter and sort posts locally for better UX
  const filteredPosts = useMemo(() => {
    if (!data?.posts) return [];
    
    let filtered = data.posts.filter(post => {
      const matchesSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.meta_desc.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      
      return matchesSearch && matchesTag && post.is_published;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [data?.posts, searchTerm, selectedTag, sortBy]);

  // Calculate estimated read time
  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Get clean preview text
  const getContentPreview = (content: string, length: number = 150): string => {
    const cleanText = content
      .replace(/#{1,6} /g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    return cleanText.length > length ? cleanText.substring(0, length) + '...' : cleanText;
  };

  // Featured posts (first 3 most recent)
  const featuredPosts = filteredPosts.slice(0, 3);
  const regularPosts = filteredPosts.slice(3);

  if (isLoading) {
    return <MatrixLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4 pb-12 flex items-center justify-center">
        <Card className="p-8 text-center bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-200 mb-2">Error Loading Blog Posts</h2>
          <p className="text-red-600 dark:text-red-300">Please try again later.</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <EnhancedSEO
        title="Blog | CryptoWebb - Cryptocurrency Analytics & Blockchain Insights"
        description="Stay updated with the latest cryptocurrency trends, blockchain technology insights, and market analysis from CryptoWebb's expert team."
        keywords={['cryptocurrency blog', 'blockchain insights', 'crypto analysis', 'market trends', 'DeFi', 'Web3']}
        breadcrumb={[
          { name: 'Home', item: '/' },
          { name: 'Blog', item: '/blog' }
        ]}
      />

      <div className="min-h-screen pt-24 px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold font-mono text-teal-600 dark:text-matrix-green mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              CRYPTO INSIGHTS
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Deep dives into cryptocurrency trends, blockchain technology, and market analysis from our expert team.
            </motion.p>
          </div>

          {/* Search and Filter Controls */}
          <Card className="mb-8 p-6 bg-white/90 dark:bg-black/90 border-teal-600 dark:border-matrix-green">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-600 dark:focus:ring-matrix-green focus:border-transparent"
                />
              </div>

              {/* Filters and Controls */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* Tag Filter */}
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-600 dark:focus:ring-matrix-green"
                >
                  <option value="">All Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-teal-600 dark:focus:ring-matrix-green"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="updated">Recently Updated</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' 
                      ? 'bg-teal-600 dark:bg-matrix-green text-white dark:text-black' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' 
                      ? 'bg-teal-600 dark:bg-matrix-green text-white dark:text-black' 
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Admin Create Button */}
                {user?.role === 'admin' && (
                  <Link to="/dashboard/blog/new">
                    <Button className="bg-teal-600 dark:bg-matrix-green hover:bg-teal-700 dark:hover:bg-matrix-green/80 text-white dark:text-black font-mono">
                      Create Post
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || selectedTag) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 dark:bg-matrix-green/20 text-teal-800 dark:text-matrix-green rounded-full text-sm">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="ml-1 hover:bg-teal-200 dark:hover:bg-matrix-green/30 rounded-full p-1">
                      ×
                    </button>
                  </span>
                )}
                {selectedTag && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 dark:bg-matrix-green/20 text-teal-800 dark:text-matrix-green rounded-full text-sm">
                    Tag: {selectedTag}
                    <button onClick={() => setSelectedTag('')} className="ml-1 hover:bg-teal-200 dark:hover:bg-matrix-green/30 rounded-full p-1">
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </Card>

          {/* Featured Posts Section */}
          {featuredPosts.length > 0 && !searchTerm && !selectedTag && (
            <motion.section 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-matrix-green" />
                <h2 className="text-2xl font-bold font-mono text-teal-600 dark:text-matrix-green">Featured Articles</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredPosts.map((post, index) => (
                  <FeaturedPostCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </motion.section>
          )}

          {/* Main Posts Grid/List */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {(searchTerm || selectedTag) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
                </h2>
              </div>
            )}

            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {(searchTerm || selectedTag ? filteredPosts : regularPosts).map((post, index) => (
                    <BlogPostCard key={post.id} post={post} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {(searchTerm || selectedTag ? filteredPosts : regularPosts).map((post, index) => (
                    <BlogPostListItem key={post.id} post={post} index={index} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No articles found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms or filters.</p>
                {(searchTerm || selectedTag) && (
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTag('');
                    }}
                    className="mt-4 bg-teal-600 dark:bg-matrix-green hover:bg-teal-700 dark:hover:bg-matrix-green/80 text-white dark:text-black"
                  >
                    Clear Filters
                  </Button>
                )}
              </motion.div>
            )}
          </motion.section>
        </motion.div>
      </div>
    </>
  );
}

// Featured Post Card Component
const FeaturedPostCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="group relative overflow-hidden rounded-xl bg-white/90 dark:bg-black/90 border border-teal-600 dark:border-matrix-green hover:shadow-xl hover:shadow-teal-600/20 dark:hover:shadow-matrix-green/20 transition-all duration-300"
  >
    {post.image_url && (
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-600 dark:bg-matrix-green text-white dark:text-black text-xs font-semibold rounded-full">
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
        </div>
      </div>
    )}
    
    <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs font-mono bg-teal-600/20 dark:bg-matrix-green/20 text-teal-600 dark:text-matrix-green rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link to={`/blog/${post.slug}`} className="block group-hover:transform group-hover:-translate-y-1 transition-transform duration-300">
        <h2 className="text-xl font-bold font-mono text-teal-600 dark:text-matrix-green mb-3 line-clamp-2 group-hover:text-teal-700 dark:group-hover:text-matrix-green/80">
          {post.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
          {post.meta_desc || getContentPreview(post.content)}
        </p>
      </Link>

      <div className="flex items-center justify-between pt-4 border-t border-teal-600/20 dark:border-matrix-green/20">
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(post.created_at).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {calculateReadTime(post.content)} min read
          </span>
        </div>
        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-teal-600 dark:text-matrix-green hover:text-teal-700 dark:hover:text-matrix-green/80 font-mono text-sm group"
        >
          Read more
          <ArrowRight className="w-3 h-3 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  </motion.article>
);

// Regular Blog Post Card Component
const BlogPostCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-700 hover:border-teal-600 dark:hover:border-matrix-green rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
  >
    {post.image_url && (
      <div className="relative h-40 overflow-hidden">
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
    )}
    
    <div className="p-5">
      <div className="flex flex-wrap gap-1 mb-3">
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link to={`/blog/${post.slug}`}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-matrix-green transition-colors">
          {post.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
          {getContentPreview(post.content, 120)}
        </p>
      </Link>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
        <span>{calculateReadTime(post.content)} min read</span>
      </div>
    </div>
  </motion.article>
);

// Blog Post List Item Component
const BlogPostListItem: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => (
  <motion.article
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group bg-white/90 dark:bg-black/90 border border-gray-200 dark:border-gray-700 hover:border-teal-600 dark:hover:border-matrix-green rounded-lg p-6 hover:shadow-lg transition-all duration-300"
  >
    <div className="flex gap-6">
      {post.image_url && (
        <div className="relative w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-teal-600 dark:group-hover:text-matrix-green transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {getContentPreview(post.content, 200)}
          </p>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {calculateReadTime(post.content)} min read
            </span>
          </div>
          <Link
            to={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-teal-600 dark:text-matrix-green hover:text-teal-700 dark:hover:text-matrix-green/80 text-sm font-medium group"
          >
            Read article
            <ArrowRight className="w-3 h-3 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  </motion.article>
);

// Helper function (moved outside component to avoid recreation)
const getContentPreview = (content: string, length: number = 150): string => {
  const cleanText = content
    .replace(/#{1,6} /g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  return cleanText.length > length ? cleanText.substring(0, length) + '...' : cleanText;
};

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};