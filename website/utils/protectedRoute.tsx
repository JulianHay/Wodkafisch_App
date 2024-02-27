"use client";

import { useEffect } from "react";
import AuthService from "./auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";

interface ProtectedRoute {
  router: AppRouterInstance;
  children: React.ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedRoute) => {
  const { isSignedIn } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/");
    }
  }, []);

  if (!isSignedIn) {
    return null;
  }

  return children;
};

const ProtectedAdminRoute = ({ children }: ProtectedRoute) => {
  const { isAdmin } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, []);

  if (!isAdmin) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
export { ProtectedAdminRoute };
