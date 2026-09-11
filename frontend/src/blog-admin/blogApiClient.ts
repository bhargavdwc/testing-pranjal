import { API_URL } from "../../config";

const TOKEN_KEY = "blogAdminToken";

export const getBlogToken = () => localStorage.getItem(TOKEN_KEY);
export const setBlogToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearBlogToken = () => localStorage.removeItem(TOKEN_KEY);

export const blogFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = getBlogToken();
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    clearBlogToken();
    window.dispatchEvent(new Event("blog-auth-expired"));
  }

  return res;
};

export const uploadBlogImage = async (
  file: File,
  folder = "pranjal-blogs",
): Promise<{ success: boolean; imageUrl: string; message?: string }> => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const res = await blogFetch("/api/blog/upload-image", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to upload image.");
  }
  return data;
};
