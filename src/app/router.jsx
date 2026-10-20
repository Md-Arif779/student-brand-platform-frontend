
import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home";
import Login from "../pages/accounts/Login";
import Signup from "../pages/accounts/Signup";
import StudentSignup from "../pages/accounts/StudentSignup";
import BrandSignup from "../pages/accounts/BrandSignup";
import VerifyOTP from "../pages/accounts/VerifyOTP";

import StudentProfile from "../pages/student/StudentProfile";
import StudentVerification from "../pages/student/StudentVerification";
import StudentDashboard from "../pages/student/StudentDashboard";

import BrandProfile from "../pages/brand/BrandProfile";
import BrandDashboard from "../pages/brand/BrandDashboard";
import BrandVerification from "../pages/brand/BrandVerification";
import ProtectedRoute from "../features/auth/ProtectedRoute";

export const router = createBrowserRouter([
  // Public website
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/signup/student",
        element: <StudentSignup />,
      },
      {
        path: "/signup/brand",
        element: <BrandSignup />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOTP />,
      },
    ],
  },

  // Authenticated user dashboard pages
  
{
  element: <DashboardLayout />,
  children: [
    {
      path: "/brand/dashboard",
      element: (
        <ProtectedRoute allowedRoles={["BRAND"]}>
          <BrandDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/brand/profile",
      element: (
        <ProtectedRoute allowedRoles={["BRAND"]}>
          <BrandProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/brand/verification",
      element: (
        <ProtectedRoute allowedRoles={["BRAND"]}>
          <BrandVerification />
        </ProtectedRoute>
      ),
    },
    {
      path: "/student/profile",
      element: (
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <StudentProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/student/dashboard",
      element: (
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <StudentDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/student/verification",
      element: (
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <StudentVerification />
        </ProtectedRoute>
      ),
    },
  ],
}

]);
