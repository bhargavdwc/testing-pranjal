export interface Blog {
  _id: string;
  title: string;
  slug: string;
  category: string[];
  readTime: string;
  date: string;
  excerpt: string;
  featureImage: string;
  content: string;
  metaTitle: string;
  canonicalUrl: string;
  keywords: string[];
  metaDescription: string;
  schema: string;
  longContent: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogStats {
  total: number;
  published: number;
  draft: number;
  scheduled: number;
}

export interface BlogFormData {
  title: string;
  slug: string;
  category: string;       // comma-separated input → split on save
  readTime: string;
  date: string;
  excerpt: string;
  featureImage: string;
  content: string;
  metaTitle: string;
  canonicalUrl: string;
  keywords: string;       // comma-separated input → split on save
  metaDescription: string;
  schema: string;
  longContent: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduledAt: string;
}

export const EMPTY_FORM: BlogFormData = {
  title: '',
  slug: '',
  category: '',
  readTime: '',
  date: new Date().toISOString().slice(0, 10),
  excerpt: '',
  featureImage: '',
  content: '',
  metaTitle: '',
  canonicalUrl: '',
  keywords: '',
  metaDescription: '',
  schema: '',
  longContent: '',
  status: 'draft',
  scheduledAt: '',
};
