'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/login', form, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      router.push('/pages/dashboard');
    } catch (err) {
      console.error('[LOGIN FAILED]', err);
      const message = err?.response?.data?.message || 'Login failed';
      setError(message);
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
              <Mail className="text-white" size={20} />
            </div>
            <p className="text-sm text-[#333333]">Log in to access your inventory</p>
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm mb-1.5 text-[#333333]">
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

          <div className="mb-8">
            <label htmlFor="password" className="block text-sm mb-1.5 text-[#333333]">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#FFA408] transition-all duration-300"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FFA408] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white cursor-pointer transition-all duration-300 ease-in-out"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="mt-7 text-center text-sm">
            <p className="text-gray-600 mb-2">Don’t have an account yet?</p>
            <Link href="/pages/register">
              <span className="text-orange-500 hover:underline">Get started here</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
