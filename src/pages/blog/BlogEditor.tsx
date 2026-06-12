// src/pages/blog/BlogEditor.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/id/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
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
            Authorization: `Bearer ${localStorage.getItem('token')}`,
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
      tags: tagInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    if (isEditing) {
      updateMutation.mutate(formattedPost);
    } else {
      createMutation.mutate(formattedPost);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value?: string) => {
    setPost((prev) => ({ ...prev, content: value || '' }));
  };

  return (
    <div className="min-h-screen pt-6 px-2" data-color-mode="dark">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight mb-8">
            {isEditing ? 'Edit blog post' : 'Create blog post'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="blog-title">Title</Label>
              <Input
                id="blog-title"
                type="text"
                name="title"
                value={post.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="blog-content">
                Content <span className="text-text-secondary font-normal">(Markdown)</span>
              </Label>
              <div className="rounded-lg overflow-hidden border border-border">
                <MDEditor
                  value={post.content}
                  onChange={handleContentChange}
                  preview="edit"
                  height={400}
                  textareaProps={{ id: 'blog-content' }}
                  style={{ backgroundColor: 'transparent' }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="blog-image">Image URL</Label>
              <Input
                id="blog-image"
                type="url"
                name="image_url"
                value={post.image_url}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="blog-tags">
                Tags <span className="text-text-secondary font-normal">(comma-separated)</span>
              </Label>
              <Input
                id="blog-tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="crypto, trading, tutorial"
              />
            </div>

            <div>
              <Label htmlFor="blog-meta">Meta description</Label>
              <Textarea
                id="blog-meta"
                name="meta_desc"
                value={post.meta_desc}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="blog-publish"
                type="checkbox"
                name="is_published"
                checked={post.is_published}
                onChange={(e) => setPost((prev) => ({ ...prev, is_published: e.target.checked }))}
                className="h-4 w-4 rounded border-border bg-surface-2 text-primary focus:ring-primary/40"
              />
              <label htmlFor="blog-publish" className="text-sm">
                Publish immediately
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate('/blog')}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving…'
                  : isEditing
                    ? 'Update post'
                    : 'Create post'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
