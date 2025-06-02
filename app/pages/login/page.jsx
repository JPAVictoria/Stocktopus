"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Mail, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useLoading } from "@/app/context/LoaderContext";
import { useSnackbar } from "@/app/context/SnackbarContext";

export default function Login() {
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { openSnackbar } = useSnackbar();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      openSnackbar("Please fill in both email and password fields.", "info");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post("/api/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      openSnackbar("Login successful! Redirecting...", "success");
      await new Promise((res) => setTimeout(res, 1000));

      setLoading(true);
      await new Promise((res) => setTimeout(res, 500));

      router.push("/pages/dashboard");
    } catch (err) {
      const msg = err?.response?.data?.message || "";

      if (msg) {
        openSnackbar("Login failed. Please check your credentials.", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen relative">
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <svg
            className="animate-spin h-12 w-12 text-[#2F27CE]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        </div>
      )}

      <div className="w-1/2 bg-[#F4F6F9] flex items-center justify-center">
        <Image
          src="/octopus.png"
          alt="Stocktopus logo"
          width={300}
          height={100}
          priority
        />
      </div>

      <div className="w-1/2 flex items-center justify-center bg-white border border-gray-200 rounded-md shadow-sm">
        <form onSubmit={handleSubmit} className="w-full max-w-md px-8 py-10">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#FFA408] rounded-full p-2 mb-2">
              <Mail className="text-white" size={20} />
            </div>
            <p className="text-sm text-[#333333]">
              Log in to access your inventory
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm mb-1.5 text-[#333333]"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              required
              className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#FFA408] transition-all duration-300"
            />
          </div>

          <div className="mb-8 relative">
            <label
              htmlFor="password"
              className="block text-sm mb-1.5 text-[#333333]"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#FFA408] transition-all duration-300 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-[35px] right-3 text-gray-400 hover:text-gray-700 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#FFA408] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white cursor-pointer transition-all duration-300 ease-in-out"
          >
            {submitting ? "Logging in..." : "Login"}
          </Button>

          <div className="mt-7 text-center text-sm">
            <p className="text-gray-600 mb-2">Don’t have an account yet?</p>
            <Link
              href="/pages/register"
              onClick={(e) => submitting && e.preventDefault()}
              className={submitting ? "pointer-events-none opacity-50" : ""}
            >
              <span className="text-orange-500 hover:underline cursor-pointer">
                Get started here
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
