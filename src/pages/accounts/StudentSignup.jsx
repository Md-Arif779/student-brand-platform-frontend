
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";

export default function StudentSignup() {
  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (formData) => {
    console.log("STUDENT REGISTRATION SUBMITTED");

    setServerError("");
    setIsSubmitting(true);

    try {
      const email = formData.email.trim().toLowerCase();
      const phone = formData.phone.trim();

      console.log("SENDING STUDENT REGISTRATION REQUEST");

      const response = await api.post(
        API_ENDPOINTS.AUTH.STUDENT_REGISTER,
        {
          email,
          phone,
          password: formData.password,
          confirm_password: formData.confirm_password,
        }
      );

      console.log(
        "STUDENT REGISTRATION RESPONSE:",
        response.data
      );

      const result = response.data;

      if (result.success === false) {
        setServerError(
          result.message || "Student registration failed."
        );
        return;
      }

      navigate("/verify-otp", {
        replace: false,
        state: {
          email,
          message:
            result.message ||
            "Registration successful. Please verify your email.",
        },
      });
    } catch (error) {
      console.error("STUDENT REGISTRATION ERROR:", error);

      const data = error.response?.data;

      console.log("EMAIL ERROR:", data?.email);
      console.log("PHONE ERROR:", data?.phone);
      console.log("FULL SERVER ERROR:", data);

      if (data) {
        const messages = [
          ...(Array.isArray(data.email) ? data.email : []),
          ...(Array.isArray(data.phone) ? data.phone : []),
          ...(Array.isArray(data.password) ? data.password : []),
          ...(Array.isArray(data.confirm_password)
            ? data.confirm_password
            : []),
          ...(Array.isArray(data.non_field_errors)
            ? data.non_field_errors
            : []),
          ...(data.detail ? [data.detail] : []),
          ...(data.message ? [data.message] : []),
        ];

        setServerError(
          messages.join(" ") ||
            "Student registration failed. Please check your information."
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
            Student Registration
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Create your free student account.
          </p>
        </div>

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
          {/* Email */}
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
              placeholder="student@example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("email", {
                required: "Email address is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("phone", {
                required: "Phone number is required.",
                validate: (value) => {
                  const normalized = value.trim();

                  if (!/^[0-9+()\-\s]+$/.test(normalized)) {
                    return "Enter a valid phone number.";
                  }

                  const digits = normalized.replace(/\D/g, "");

                  if (digits.length < 10) {
                    return "Phone number must contain at least 10 digits.";
                  }

                  if (digits.length > 15) {
                    return "Phone number cannot exceed 15 digits.";
                  }

                  return true;
                },
              })}
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
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
              autoComplete="new-password"
              placeholder="Create a password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must contain at least 8 characters.",
                },
              })}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm_password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <input
              id="confirm_password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your password again"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              {...register("confirm_password", {
                required: "Please confirm your password.",
                validate: (value) =>
                  value === password || "Passwords do not match.",
              })}
            />

            {errors.confirm_password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirm_password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Creating account..."
              : "Create Student Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

