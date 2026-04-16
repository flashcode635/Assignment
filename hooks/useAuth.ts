"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

interface DecodedToken {
  userId: string;
  role: "USER" | "ADMIN";
  exp: number;
  iat: number;
}

export function useAuth() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Decode JWT token (simple base64 decode - client-side only for UI purposes)
  const decodeToken = useCallback((token: string): DecodedToken | null => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }, []);

  // Get current user from token
  const getUser = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const decoded = decodeToken(token);
    if (!decoded) return null;

    return {
      userId: decoded.userId,
      role: decoded.role,
    };
  }, [decodeToken]);

  // Refresh access token
  const refreshToken = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      const response = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        credentials: "include", // Important: sends httpOnly cookies
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
        console.log("Token refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      // If refresh fails, logout user
      logout();
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to clear refresh token cookie
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear access token from localStorage
      localStorage.removeItem("accessToken");
      // Redirect to login page
      router.push("/login");
    }
  }, [router]);

  // Set up auto-refresh every 14 minutes (840000 ms)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    // Refresh immediately if token is close to expiry
    const decoded = decodeToken(token);
    if (decoded) {
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - now;

      // If token expires in less than 2 minutes, refresh immediately
      if (timeUntilExpiry < 120) {
        refreshToken();
      }
    }

    // Set up interval to refresh every 14 minutes
    const REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes in milliseconds
    const intervalId = setInterval(() => {
      refreshToken();
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [refreshToken, decodeToken]);

  return {
    getUser,
    logout,
    refreshToken,
    isRefreshing,
  };
}
