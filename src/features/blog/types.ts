export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
}
