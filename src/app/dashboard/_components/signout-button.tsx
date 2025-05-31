"use client";

import { Button } from "@/src/_components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

const SignoutButton = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("/authentication");
            },
          },
        })
      }
    >
      Logout
    </Button>
  );
};

export default SignoutButton;
