"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMutation } from "convex/react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { GetAuthUserData } from "@/services/GlobalApi";
import { api } from "@/convex/_generated/api";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
function SignIn() {
  const CreateUser = useMutation(api.users.CreateUser);
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("user_token", tokenResponse.access_token);
      }

      const user = await GetAuthUserData(tokenResponse.access_token);
      const result = await CreateUser({
        name: user?.name,
        email: user?.email,
        picture: user?.picture,
      });

      setUser(result);
      router.replace("/ai-assistants");
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-5 border border-2xl p-10 shadow-md">
        <Image src="/logo.svg" alt="logo" width={100} height={100} />
        <h2 className="text-2xl">Sign in to Assist</h2>
        <Button onClick={() => googleLogin()}>Sign in with Gmail</Button>
      </div>
    </div>
  );
}
export default SignIn;
