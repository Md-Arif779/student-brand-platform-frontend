import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";

const initialForm = {
  full_name: "",
  date_of_birth: "",
  gender: "",
  bio: "",
  location: "",
  skills: "",
};

export default function StudentProfile() {
  const [formData, setFormData] = useState(initialForm);
  const [profileExists, setProfileExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(
          API_ENDPOINTS.STUDENT.PROFILE
        );

        const profile = response.data?.data;

        if (profile) {
          setProfileExists(true);

          setFormData({
            full_name: profile.full_name || "",
            date_of_birth: profile.date_of_birth || "",
            gender: profile.gender || "",
            bio: profile.bio || "",
            location: profile.location || "",
            skills: Array.isArray(profile.skills)
              ? profile.skills.join(", ")
              : "",
          });
        }
      } catch (err) {
        console.error("STUDENT PROFILE FETCH ERROR:", err);

        setError(
          err.response?.data?.detail ||
            "Unable to load your profile. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setIsSaving(true);

    const payload = {
      full_name: formData.full_name.trim(),
      date_of_birth: formData.date_of_birth || null,
      gender: formData.gender.trim(),
      bio: formData.bio.trim(),
      location: formData.location.trim(),
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      const response = profileExists
        ? await api.put(
            API_ENDPOINTS.STUDENT.PROFILE,
            payload
          )
        : await api.post(
            API_ENDPOINTS.STUDENT.PROFILE,
            payload
          );

      const profile = response.data?.data;

      if (profile) {
        setProfileExists(true);

        setFormData({
          full_name: profile.full_name || "",
          date_of_birth: profile.date_of_birth || "",
          gender: profile.gender || "",
          bio: profile.bio || "",
          location: profile.location || "",
          skills: Array.isArray(profile.skills)
            ? profile.skills.join(", ")
            : "",
        });
      } else {
        setProfileExists(true);
      }

      setMessage(
        response.data?.message ||
          "Student profile saved successfully."
      );
    } catch (err) {
      console.error("STUDENT PROFILE SAVE ERROR:", err);

      const data = err.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.entries(data).flatMap(
          ([field, value]) => {
            const details = Array.isArray(value)
              ? value
              : typeof value === "string"
                ? [value]
                : [];

            return details.map(
              (item) => `${field}: ${item}`
            );
          }
        );

        setError(
          messages.join(" ") ||
            "Unable to save your profile."
        );
      } else {
        setError(
          "Unable to connect to the server. Please try again."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <section className="px-4 py-16 text-center">
        <p className="text-gray-600">
          Loading your profile...
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-8">
          <Link
            to="/student/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Student Profile
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Complete your profile to prepare for university
            verification and future opportunities.
          </p>
        </div>

        {message && (
          <div
            role="status"
            className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="full_name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              required
              maxLength={150}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="date_of_birth"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>

            <input
              id="date_of_birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Gender
            </label>

            <input
              id="gender"
              name="gender"
              type="text"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Enter gender"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, District"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="skills"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Skills
            </label>

            <input
              id="skills"
              name="skills"
              type="text"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Video Editing, Design, Content Writing"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1 text-xs text-gray-500">
              Separate multiple skills with commas.
            </p>
          </div>

          <div>
            <label
              htmlFor="bio"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              About You
            </label>

            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Introduce yourself and your interests..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving
              ? "Saving Profile..."
              : profileExists
                ? "Update Profile"
                : "Save Profile"}
          </button>
        </form>
      </div>
    </section>
  );
}