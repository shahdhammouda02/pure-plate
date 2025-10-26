"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function SignInPage() {
  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/planner" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-green-50">
      <h1 className="text-3xl font-bold text-gray-900">Sign In to PurePlate</h1>
      <Button
        onClick={handleGoogleSignIn}
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white border-none px-6 py-3 rounded-lg"
      >
        <LogIn className="w-5 h-5" />
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
}
