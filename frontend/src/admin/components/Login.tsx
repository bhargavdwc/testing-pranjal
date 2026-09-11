import React, { useState } from "react";
import { Loader2, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";
import { API_URL } from "../../../config";
import Logo from "../../assets/SignatureSticker.webp";

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [emailInput, setEmailInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setErrorMsg("Please enter your email.");
      return;
    }
    if (cleanEmail.length > 50) {
      setErrorMsg("Email address must not exceed 50 characters.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // First try direct login (bypasses OTP for whitelisted email)
      const directRes = await fetch(`${API_URL}/api/auth/direct-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const directData = await directRes.json();

      if (directRes.ok && directData.token) {
        onLoginSuccess(directData.token);
        return;
      }

      // If direct login not allowed, fall back to OTP flow
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStep("otp");
        setSuccessMsg(data.message || "OTP sent to your email.");
      } else {
        setErrorMsg(data.message || "Failed to send OTP.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otpInput.trim();
    if (!cleanOtp) {
      setErrorMsg("Please enter the OTP.");
      return;
    }
    if (cleanOtp.length > 6) {
      setErrorMsg("OTP must not exceed 6 characters.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput.trim(), otp: cleanOtp }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        onLoginSuccess(data.token);
      } else {
        setErrorMsg(data.message || "Invalid OTP.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-sm shadow-xl w-full max-w-md border border-slate-100 relative">
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={Logo}
            alt="Pranjal Sarkar Admin"
            className="w-48 h-auto object-contain mb-6 drop-shadow-sm filter brightness-0"
          />
          <h2 className="text-2xl font-black text-slate-800">Admin Login</h2>
          <p className="text-slate-500 text-sm mt-2">
            Secure access via Email OTP
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-sm text-sm font-semibold border border-red-200 text-center mb-4">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-sm text-sm font-semibold border border-emerald-200 text-center mb-4">
            {successMsg}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2"
              >
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                required
                maxLength={50}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value.slice(0, 50))}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-slate-900 text-sm font-semibold focus:border-blue-500 outline-none transition-colors"
                placeholder="admin@example.com"
              />
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
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label
                htmlFor="login-otp"
                className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2"
              >
                One-Time Password (OTP)
              </label>
              <input
                id="login-otp"
                type="text"
                required
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.trim().slice(0, 6))}
                className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-sm text-slate-900 text-center text-2xl tracking-[0.5em] font-semibold focus:border-blue-500 outline-none transition-colors uppercase"
                placeholder="------"
              />
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
                  <ShieldCheck className="w-5 h-5" />
                  <span>Verify & Login</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtpInput("");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="w-full mt-4 text-slate-500 hover:text-slate-800 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Email</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
