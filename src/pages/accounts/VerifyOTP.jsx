
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";

export default function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email,
      otp: "",
    },
  });

  const onSubmit = async (formData) => {
    setServerError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await api.post(
        API_ENDPOINTS.AUTH.VERIFY_OTP,
        {
          email: formData.email.trim().toLowerCase(),
          otp: formData.otp.trim(),
        }
      );

      setSuccessMessage(
        response.data.message || "Email verified successfully."
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            registeredEmail: formData.email.trim().toLowerCase(),
            message: "Email verified successfully. Please log in.",
          },
        });
      }, 1000);
    } catch (error) {
      const data = error.response?.data;

      setServerError(
        data?.detail ||
          data?.message ||
          data?.email?.[0] ||
          data?.otp?.[0] ||
          "OTP verification failed. Please check your code."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setServerError("");
    setSuccessMessage("");

    if (!email) {
      setServerError("Please register again or enter your registered email.");
      return;
    }

    try {
      const response = await api.post(
        API_ENDPOINTS.AUTH.RESEND_OTP,
        { email: email.trim().toLowerCase() }
      );

      setSuccessMessage(
        response.data.message || "A new OTP has been requested."
      );
    } catch (error) {
      const data = error.response?.data;

      setServerError(
        data?.detail ||
          data?.message ||
          "Unable to resend OTP. Please try again."
      );
    }
  };

  return (
    <section className="min-h-[80vh] bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Verify Your Email
        </h1>

        <p className="mb-6 text-center text-sm text-gray-600">
          Enter the 6-digit OTP sent to your registered email.
        </p>

        {serverError && (
          <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              readOnly={Boolean(email)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              {...register("email", {
                required: "Email address is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-medium text-gray-700">
              Verification Code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              {...register("otp", {
                required: "OTP is required.",
                pattern: {
                  value: /^\d{6}$/,
                  message: "OTP must contain exactly 6 digits.",
                },
              })}
            />

            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResendOTP}
          className="mt-4 w-full text-sm font-medium text-blue-600 hover:underline"
        >
          Resend OTP
        </button>

        <p className="mt-5 text-center text-sm text-gray-600">
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </section>
  );
}
