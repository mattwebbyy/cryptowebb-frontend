
// src/features/blog/api.ts
import axios from 'axios';
import { BlogPost } from './types';

const API_URL = process.env.VITE_API_URL;

export const blogApi = {
    async getPosts(page = 1, limit = 10) {
        const response = await axios.get(`${API_URL}/api/blog`, {
            params: { page, limit }
        });
        return response.data;
    },

    async getPost(slug: string) {
        const response = await axios.get(`${API_URL}/api/blog/${slug}`);
        return response.data;
    },

    async createPost(post: Partial<BlogPost>) {
        const response = await axios.post(`${API_URL}/api/blog`, post);
        return response.data;
    },

    async updatePost(id: number, post: Partial<BlogPost>) {
        const response = await axios.put(`${API_URL}/api/blog/${id}`, post);
        return response.data;
    },

    async deletePost(id: number) {
        await axios.delete(`${API_URL}/api/blog/${id}`);
    }
};