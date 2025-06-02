"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ClipboardPen, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/app/context/LoaderContext";
import { useSnackbar } from "@/app/context/SnackbarContext";

export default function Register() {
  const router = useRouter();
  const { loading, setLoading } = useLoading();
  const { openSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const isPasswordValid = (pwd) => pwd.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      openSnackbar("Please fill in all fields", "error");
      return;
    }
    if (!isPasswordValid(form.password)) {
      openSnackbar("Password must be at least 8 characters long", "error");
      return;
    }

    if (form.password !== form.confirmPassword) {
      openSnackbar("Passwords do not match", "error");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("/api/register", form, {
        headers: { "Content-Type": "application/json" },
      });
      openSnackbar("Registration successful! Redirecting...", "success");
      setSubmitting(false);
      setLoading(true);
      router.push("/pages/login");
    } catch (err) {
      const msg = err?.response?.data?.message || "Registration failed";
      openSnackbar(msg, "error");
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen">
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
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md px-8 py-10 relative"
          noValidate
        >
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#FFA408] rounded-full p-2 mb-2">
              <ClipboardPen className="text-white" size={20} />
            </div>
            <p className="text-sm text-[#333333] font-regular">
              Start your journey with us – Register now!
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm mb-1.5 text-[#333333]"
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
              className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#FFA408] transition-all duration-300"
            />
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
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={handleChange}
              required
              className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#FFA408] transition-all duration-300"
            />
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="block text-sm mb-1.5 text-[#333333]"
            >
              Password
            </label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
              className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#FFA408] transition-all duration-300 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-[35px] right-3 text-gray-400 hover:text-gray-700 transition"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="mb-6 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm mb-1.5 text-[#333333]"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#FFA408] transition-all duration-300 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute top-[35px] right-3 text-gray-400 hover:text-gray-700 transition"
              tabIndex={-1}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-[#FFA408] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white cursor-pointer transition-all duration-300 ease-in-out"
          >
            {submitting ? "Registering..." : "Register"}
          </Button>

          <div className="mt-7 text-center text-sm">
            <p className="text-gray-600 mb-2">Remember your account?</p>
            <Link
              href="/pages/login"
              onClick={(e) => submitting && e.preventDefault()}
              className={submitting ? "pointer-events-none opacity-50" : ""}
            >
              <span className="text-orange-500 hover:underline cursor-pointer">
                Back to login
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
