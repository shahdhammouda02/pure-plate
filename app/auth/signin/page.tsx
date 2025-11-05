"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logo from "@/public/images/logo.png";
import image from "@/public/images/planner2.png";

type FormValues = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const [loading, setLoading] = useState(false);

  // ✅ Keep your Google sign-in logic untouched
  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/planner" });
  };

  // ✅ Handle real email/password sign-in
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "/planner",
    });

    setLoading(false);

    if (res?.error) {
      alert("Invalid email or password");
    } else {
      router.push("/planner");
    }
  };

  return (
    <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center min-h-screen py-8 px-4 sm:py-12 sm:px-6 lg:px-10 lg:py-12">
      {/* Background image for mobile */}
      <div className="lg:hidden fixed inset-0 -z-10">
        <Image
          src={image}
          alt="PurePlate Dish"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Left side image - Desktop only */}
      <div className="hidden lg:flex w-1/2 h-full items-center justify-center p-0 m-0">
        <Image
          src={image}
          alt="PurePlate Dish"
          width={600}
          height={800}
          className="w-full h-full object-cover rounded-l-3xl shadow-md"
          style={{
            minHeight: "600px",
            maxHeight: "800px",
          }}
        />
      </div>

      {/* Right side form */}
      <div
        className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center bg-green-50 lg:bg-green-50 py-8 sm:py-12 lg:py-32 px-4 sm:px-6 lg:px-10 rounded-3xl lg:rounded-r-3xl lg:rounded-l-none shadow-inner backdrop-blur-lg lg:backdrop-blur-none"
        style={{
          minHeight: "500px",
          maxHeight: "800px",
        }}
      >
        {/* Logo and Welcome Text */}
        <div className="flex flex-col items-center space-y-2 mb-4 sm:mb-6">
          <Image
            src={logo}
            alt="PurePlate Logo"
            width={120}
            height={45}
            className="object-contain w-28 sm:w-32 lg:w-36"
          />
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Sign In to PurePlate
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-xs sm:max-w-sm lg:max-w-md bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg space-y-4 sm:space-y-5 border border-gray-200"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              {...register("email", { required: "Email is required" })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              {...register("password", { required: "Password is required" })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-green-600 hover:text-green-700">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-lg font-medium cursor-pointer text-sm sm:text-base"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {/* OR divider */}
          <div className="flex items-center justify-center my-3 sm:my-4">
            <div className="grow border-t border-gray-300"></div>
            <span className="mx-3 sm:mx-4 text-xs sm:text-sm text-gray-500">
              OR CONTINUE WITH
            </span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          {/* Google Sign-In Button */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            className="cursor-pointer flex items-center justify-center space-x-2 sm:space-x-3 w-full border border-gray-300 hover:bg-gray-50 bg-green-50 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
