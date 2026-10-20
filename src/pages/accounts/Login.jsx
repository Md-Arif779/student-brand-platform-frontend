
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import { loginSuccess } from "../../features/auth/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageMessage = location.state?.message || "";
  const registeredEmail = location.state?.registeredEmail || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: registeredEmail,
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    setServerError("");
    setIsSubmitting(true);

    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      const result = response.data;

      if (
        !result.success ||
        !result.data?.user ||
        !result.data?.tokens?.access ||
        !result.data?.tokens?.refresh
      ) {
        setServerError("Unexpected response from the server.");
        return;
      }

      const { user, tokens } = result.data;

      // Save authenticated user and tokens.
      dispatch(
        loginSuccess({
          user,
          access: tokens.access,
          refresh: tokens.refresh,
        })
      );

      // Normalize the role value returned by the backend.
      const role = String(
        user.role ?? user.user_type ?? user.account_type ?? ""
      )
        .trim()
        .toUpperCase();

      // Redirect according to the user's role.
      if (role === "BRAND") {
        navigate("/brand/dashboard", { replace: true });
      } else if (role === "STUDENT") {
        navigate("/student/dashboard", { replace: true });
      } else if (role === "ADMIN" || role === "SUPERUSER") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        setServerError(
          "Login succeeded, but your account role could not be identified. Please contact support."
        );
      }
    } catch (error) {
      console.error("LOGIN API ERROR:", error);

      const responseData = error.response?.data;

      if (responseData) {
        setServerError(
          responseData.detail ||
            responseData.message ||
            responseData.email?.[0] ||
            responseData.password?.[0] ||
            responseData.non_field_errors?.[0] ||
            "Login failed. Please check your credentials."
        );
      } else {
        setServerError(
          "Unable to connect to the server. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[80vh] bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Log in to your Student Brand Platform account.
          </p>
        </div>

        {pageMessage && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            {pageMessage}
          </div>
        )}

        {serverError && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("email", {
                required: "Email address is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address.",
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("password", {
                required: "Password is required.",
              })}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
