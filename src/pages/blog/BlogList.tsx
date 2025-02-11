// src/pages/blog/BlogList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

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
      const response = await axios.get<BlogResponse>(`${import.meta.env.VITE_API_URL}/api/v1/blog`);
      return response.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
        {user?.role === 'admin' && (
          <Link
            to="/dashboard/blog/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create New Post
          </Link>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data?.posts.map((post: BlogPost) => (
          <article key={post.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
            {post.image_url && (
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover"
                  src={post.image_url}
                  alt={post.title}
                />
              </div>
            )}
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to={`/blog/${post.slug}`} className="block mt-2">
                  <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                  <p className="mt-3 text-base text-gray-500">
                    {post.content.slice(0, 150)}...
                  </p>
                </Link>
              </div>
              <div className="mt-6">
                <div className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}