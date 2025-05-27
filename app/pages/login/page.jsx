import Image from "next/image";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 bg-[#f7f9fc] flex items-center justify-center">
        <Image
          src="/octopus.png"
          alt="Stocktopus logo"
          width={300}
          height={100}
          priority
        />
      </div>
      <div className="w-1/2 flex items-center justify-center bg-white border border-gray-200 rounded-md shadow-sm">
        <div className="w-full max-w-md px-8 py-10">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-[#FFA408] rounded-full p-2 mb-2">
              <Mail className="text-white" size={20} />{" "}
            </div>{" "}
            <p className="text-sm text-[#333333] font-light">
              Log in to access your inventory{" "}
            </p>{" "}
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm mb-1.5 text-[#333333] font-regular"
            >
              Email{" "}
            </label>{" "}
            <Input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#FFA408] transition-all duration-300"
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-sm mb-1.5 text-[#333333] font-regular"
            >
              Password{" "}
            </label>{" "}
            <Input
              id="password"
              type="password"
              placeholder="********"
              className="peer focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-[#FFA408] transition-all duration-300"
            />
          </div>
          <Button className="w-full bg-gradient-to-r from-[#FFA408] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white cursor-pointer">
            Login
          </Button>
          <div className="mt-7 text-center text-sm">
            <p className="text-gray-600 mb-2">Don’ t have an account yet ? </p>
            <Link href="/register">
              <span className="text-orange-500 hover:underline">
                Get started here
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
