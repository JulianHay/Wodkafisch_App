"use client";

import { useEffect } from "react";
import AuthService from "./auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

interface ProtectedRoute {
  router: AppRouterInstance;
  children: React.ReactNode;
}
const ProtectedRoute = ({ children }: ProtectedRoute) => {
  const { isSignedIn } = useSelector((state) => state.user);
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
  const { isAdmin } = useSelector((state) => state.user);
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
