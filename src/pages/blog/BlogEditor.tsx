// src/pages/blog/BlogEditor.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import MDEditor from '@uiw/react-md-editor';

interface BlogPost {
  title: string;
  content: string;
  image_url: string;
  tags: string[];
  meta_desc: string;
  is_published: boolean;
}

export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const [post, setPost] = useState<BlogPost>({
    title: '',
    content: '',
    image_url: '',
    tags: [],
    meta_desc: '',
    is_published: false,
  });

  const [tagInput, setTagInput] = useState('');

  // Fetch existing post data if editing
  const { data: existingPost } = useQuery({
    queryKey: ['blog-edit', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/id/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    },
    enabled: !!id,
  });

  // Load existing post data when available
  useEffect(() => {
    if (existingPost) {
      setPost({
        title: existingPost.title || '',
        content: existingPost.content || '',
        image_url: existingPost.image_url || '',
        tags: existingPost.tags || [],
        meta_desc: existingPost.meta_desc || '',
        is_published: existingPost.is_published || false,
      });
      setTagInput(existingPost.tags?.join(', ') || '');
    }
  }, [existingPost]);

  // Redirect if not admin
  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Only admins can edit posts');
      navigate('/blog');
    }
  }, [user, navigate]);

  const createMutation = useMutation({
    mutationFn: async (newPost: BlogPost) => {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog`,
        newPost,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Blog post created successfully');
      navigate('/blog');
    },
    onError: (error) => {
      toast.error('Failed to create blog post');
      console.error('Error:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedPost: BlogPost) => {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${id}`,
        updatedPost,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Blog post updated successfully');
      navigate('/blog');
    },
    onError: (error) => {
      toast.error('Failed to update blog post');
      console.error('Error:', error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPost = {
      ...post,
      tags: tagInput.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (isEditing) {
      updateMutation.mutate(formattedPost);
    } else {
      createMutation.mutate(formattedPost);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value?: string) => {
    setPost(prev => ({ ...prev, content: value || '' }));
  };

  return (
    <div className="min-h-screen pt-20 px-4" data-color-mode="dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-4xl mx-auto bg-black/90 border border-matrix-green p-6">
          <h1 className="text-3xl font-mono text-matrix-green mb-8">
            {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-matrix-green font-mono mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={post.title}
                onChange={handleChange}
                className="w-full bg-black/50 border border-matrix-green p-2 text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green/50"
                required
              />
            </div>

            <div>
              <label className="block text-matrix-green font-mono mb-2">
                Content (Markdown Supported)
              </label>
              <div className="markdown-editor-wrapper">
                <MDEditor
                  value={post.content}
                  onChange={handleContentChange}
                  preview="edit"
                  height={400}
                  className="bg-black/50 border border-matrix-green"
                  style={{
                    backgroundColor: 'transparent',
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-matrix-green font-mono mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={post.image_url}
                onChange={handleChange}
                className="w-full bg-black/50 border border-matrix-green p-2 text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green/50"
              />
            </div>

            <div>
              <label className="block text-matrix-green font-mono mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full bg-black/50 border border-matrix-green p-2 text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green/50"
                placeholder="crypto, trading, tutorial"
              />
            </div>

            <div>
              <label className="block text-matrix-green font-mono mb-2">
                Meta Description
              </label>
              <textarea
                name="meta_desc"
                value={post.meta_desc}
                onChange={handleChange}
                rows={3}
                className="w-full bg-black/50 border border-matrix-green p-2 text-matrix-green focus:outline-none focus:ring-2 focus:ring-matrix-green/50"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_published"
                checked={post.is_published}
                onChange={(e) => setPost(prev => ({ ...prev, is_published: e.target.checked }))}
                className="mr-2 bg-black/50 border-matrix-green text-matrix-green focus:ring-matrix-green"
              />
              <label className="text-matrix-green font-mono">
                Publish immediately
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => navigate('/blog')}
                className="bg-black/50 hover:bg-black/70 text-matrix-green border border-matrix-green font-mono"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-matrix-green hover:bg-matrix-green/80 text-black font-mono"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : isEditing
                  ? 'Update Post'
                  : 'Create Post'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}