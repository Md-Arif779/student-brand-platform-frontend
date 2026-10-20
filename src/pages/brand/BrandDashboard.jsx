
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function BrandDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await api.get("/brand/profile/");
        setProfile(response.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load brand dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <main className="mx-auto max-w-6xl p-6">Loading dashboard...</main>;
  }

  if (error || !profile) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <p className="text-red-600">{error || "Brand profile not found."}</p>
      </main>
    );
  }

  const status = profile.verification_status || "NOT_SUBMITTED";

  const statusStyles = {
    APPROVED: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    UNDER_REVIEW: "bg-blue-100 text-blue-800",
    REJECTED: "bg-red-100 text-red-800",
    RESUBMIT_REQUIRED: "bg-orange-100 text-orange-800",
    NOT_SUBMITTED: "bg-gray-100 text-gray-700",
  };

  const sections = [
    {
      title: "Company Profile",
      description: "Manage your company details and verification.",
      link: "/brand/profile",
      action: "View Profile",
    },
    {
      title: "Subscription & Packages",
      description: "Manage your plan and available credits.",
      link: "/brand/subscription",
      action: "View Packages",
    },
    {
      title: "My GIGs",
      description: "Create and manage your student campaigns.",
      link: "/brand/gigs",
      action: "Manage GIGs",
    },
    {
      title: "Applications",
      description: "Review applicants and manage selected students.",
      link: "/brand/applications",
      action: "View Applications",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            Brand Portal
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Welcome, {profile.company_name}
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your company profile, campaigns and student collaborations.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Verification Status
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Your verification status determines whether you can create GIGs.
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                statusStyles[status] || statusStyles.NOT_SUBMITTED
              }`}
            >
              {status.replaceAll("_", " ")}
            </span>
          </div>

          {status !== "APPROVED" && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-600">
                {status === "PENDING" || status === "UNDER_REVIEW"
                  ? "Your verification request is awaiting review."
                  : status === "REJECTED" || status === "RESUBMIT_REQUIRED"
                    ? profile.rejection_reason ||
                      "Please review your verification requirements."
                    : "Submit your verification request to get started."}
              </p>

              <Link
                to="/brand/profile"
                className="mt-3 inline-block font-semibold text-blue-700 hover:text-blue-900"
              >
                Manage Verification →
              </Link>
            </div>
          )}
        </section>

        <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Verification",
              value: status.replaceAll("_", " "),
              color: "text-blue-700",
            },
            {
              label: "Subscription",
              value: "Not connected",
              color: "text-gray-500",
            },
            {
              label: "Active GIGs",
              value: "Not available",
              color: "text-gray-500",
            },
            {
              label: "Applications",
              value: "Not available",
              color: "text-gray-500",
            },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className={`mt-3 text-xl font-bold ${item.color}`}>
                {item.value}
              </p>
            </article>
          ))}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Manage Your Brand
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {section.description}
                </p>

                <Link
                  to={section.link}
                  className="mt-5 inline-flex font-semibold text-blue-700 hover:text-blue-900"
                >
                  {section.action} →
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
