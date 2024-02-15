"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import AuthService from "./auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSelector } from "react-redux";

interface ProtectedRoute {
  router: AppRouterInstance;
  children: React.ReactNode;
}
const ProtectedRoute = ({ router, children }: ProtectedRoute) => {
  const { isSignedIn } = useSelector((state) => state.user);

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

export default ProtectedRoute;
