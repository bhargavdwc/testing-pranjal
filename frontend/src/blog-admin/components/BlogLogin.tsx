import React, { useState } from "react";
import { Loader2, ArrowRight, BookOpen, Eye, EyeOff } from "lucide-react";
import { API_URL } from "../../../config";
import { setBlogToken } from "../blogApiClient";
import Logo from "../../assets/SignatureSticker.webp";

interface BlogLoginProps {
  onLoginSuccess: () => void;
}

export const BlogLogin: React.FC<BlogLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }
    if (cleanUsername.length > 15) {
      setErrorMsg("Username must not exceed 15 characters.");
      return;
    }
    if (password.length > 15) {
      setErrorMsg("Password must not exceed 15 characters.");
      return;
    }
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${API_URL}/api/blog-auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUsername, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setBlogToken(data.token);
        onLoginSuccess();
      } else {
        setErrorMsg(data.message || "Invalid credentials.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-sm shadow-xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={Logo}
            alt="Pranjal Sarkar Blog Admin"
            className="w-48 h-auto object-contain mb-6 drop-shadow-sm filter brightness-0"
          />
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-black text-slate-800">Blog Admin</h2>
          </div>
          <p className="text-slate-500 text-sm">Sign in to manage your blog</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-sm text-sm font-semibold border border-red-200 text-center mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="blog-username" className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              id="blog-username"
              type="text"
              required
              maxLength={15}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 15))}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-slate-900 text-sm font-semibold focus:border-blue-500 outline-none transition-colors"
              placeholder="blogadmin"
            />
          </div>
          <div>
            <label htmlFor="blog-password" className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="blog-password"
                type={showPassword ? "text" : "password"}
                required
                maxLength={15}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value.slice(0, 15))}
                className="w-full bg-slate-50 border border-slate-200 pl-4 pr-11 py-3 rounded-sm text-slate-900 text-sm font-semibold focus:border-blue-500 outline-none transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-sm mt-6 shadow-lg shadow-blue-500/30 cursor-pointer flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
