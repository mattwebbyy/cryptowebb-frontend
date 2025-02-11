// src/pages/blog/BlogPost.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const response = await axios.get<BlogPost>(`${import.meta.env.VITE_API_URL}/api/v1/blog/${slug}`);
      return response.data;
    },
    enabled: !!slug // Only run query if we have a slug
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
          <p className="mt-2 text-gray-600">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="mt-4 text-blue-600 hover:text-blue-800">
            Return to blog list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {user?.role === 'admin' && (
        <div className="flex justify-end mb-6">
          <Link
            to={`/dashboard/blog/edit/${post.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Edit Post
          </Link>
        </div>
      )}

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg shadow-lg mb-8"
        />
      )}

      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {post.tags.map((tag: string) => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-500 mb-8">
        Published on{' '}
        {new Date(post.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>

      <div className="prose prose-lg max-w-none">
        {post.content.split('\n').map((paragraph: string, index: number) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <Link to="/blog" className="text-blue-600 hover:text-blue-800">
          ← Back to all posts
        </Link>
      </div>
    </div>
  );
}