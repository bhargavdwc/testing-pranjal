export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  featured?: boolean;
  tags: string[];
  takeaways: string[];
  content: {
    heading: string;
    body: string;
    quote?: string;
  }[];
}

export const BLOG_CATEGORIES = [
  'All',
  'Product Judgment',
  'AI Strategy',
  'Executive Leadership',
  'Boardroom Strategy',
  'Career Transition',
] as const;

// All blog posts are dynamically loaded from the database via the API
export const BLOG_POSTS: BlogPost[] = [];
