'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ClipboardPen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update form state on input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await axios.post('/api/register', form, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // On success, redirect to login page
      router.push('/pages/login');
    } catch (err) {
      console.error('[REGISTER ERROR]', err);
      // Show backend or generic error message
      const msg = err?.response?.data?.message || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
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
              <ClipboardPen className="text-white" size={20} />
            </div>
            <p className="text-sm text-[#333333] font-regular">
              Start your journey with us – Register now!
            </p>
          </div>

          {/* Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm mb-1.5 text-[#333333]">
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

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm mb-1.5 text-[#333333]">
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

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm mb-1.5 text-[#333333]">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
              className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#FFA408] transition-all duration-300"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm mb-1.5 text-[#333333]"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="********"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#FFA408] transition-all duration-300"
            />
          </div>

          {/* Show error if any */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FFA408] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white cursor-pointer transition-all duration-300 ease-in-out"
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>

          <div className="mt-7 text-center text-sm">
            <p className="text-gray-600 mb-2">Remember your account?</p>
            <Link href="/pages/login">
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
