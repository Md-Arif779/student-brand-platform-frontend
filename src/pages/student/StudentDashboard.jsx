import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-800",
    description: "Your verification is waiting for admin review.",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "border-blue-200 bg-blue-50 text-blue-800",
    description: "The admin is reviewing your information.",
  },
  APPROVED: {
    label: "Approved",
    className: "border-green-200 bg-green-50 text-green-800",
    description: "Your student verification has been approved.",
  },
  REJECTED: {
    label: "Rejected",
    className: "border-red-200 bg-red-50 text-red-800",
    description: "Review the admin feedback and resubmit your information.",
  },
  RESUBMIT_REQUIRED: {
    label: "Resubmission Required",
    className: "border-orange-200 bg-orange-50 text-orange-800",
    description: "Please update the information requested by the admin.",
  },
  NOT_SUBMITTED: {
    label: "Not Submitted",
    className: "border-slate-200 bg-slate-50 text-slate-700",
    description: "Submit your university verification information to get started.",
  },
};

function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [verification, setVerification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchVerification = async () => {
      try {
        const response = await api.get(
          API_ENDPOINTS.STUDENT.VERIFICATION
        );

        if (isMounted) {
          setVerification(response.data?.data ?? null);
          setVerificationError("");
        }
      } catch (error) {
        if (isMounted) {
          setVerificationError(
            error.response?.data?.message ||
              error.response?.data?.detail ||
              "Unable to load your verification status."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchVerification();

    return () => {
      isMounted = false;
    };
  }, []);

  const status = verification?.status || "NOT_SUBMITTED";
  const statusConfig =
    STATUS_CONFIG[status] || STATUS_CONFIG.NOT_SUBMITTED;

  const cards = [
    {
      title: "University Verification",
      description: statusConfig.description,
      link: "/student/verification",
      action: "View verification",
    },
    {
      title: "My Profile",
      description: "Keep your personal details, skills and portfolio updated.",
      link: "/student/profile",
      action: "Manage profile",
    },
    {
      title: "Explore GIGs",
      description: "Discover opportunities from brands.",
      link: null,
      action: "Coming soon",
    },
    {
      title: "My Applications",
      description: "Track the status of your applications.",
      link: null,
      action: "Coming soon",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section>
        <p className="text-sm font-medium text-blue-700">
          STUDENT WORKSPACE
        </p>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome, {user?.first_name || user?.username || "Student"}!
        </h1>

        <p className="mt-2 text-slate-600">
          Manage your profile, verify your university and prepare for
          opportunities from brands.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              University Verification
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Your current verification progress.
            </p>
          </div>

          {isLoading ? (
            <span className="text-sm text-slate-500">
              Loading status...
            </span>
          ) : (
            <span
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${statusConfig.className}`}
            >
              {statusConfig.label}
            </span>
          )}
        </div>

        {verificationError ? (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {verificationError}
          </p>
        ) : (
          !isLoading && (
            <>
              <p className="mt-3 text-sm text-slate-600">
                {statusConfig.description}
              </p>

              {verification?.university_name && (
                <p className="mt-2 text-sm text-slate-700">
                  <strong>University:</strong>{" "}
                  {verification.university_name}
                </p>
              )}

              {verification?.rejection_reason && (
                <p className="mt-2 text-sm text-red-700">
                  <strong>Admin feedback:</strong>{" "}
                  {verification.rejection_reason}
                </p>
              )}
            </>
          )
        )}

        <Link
          to="/student/verification"
          className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          {status === "APPROVED"
            ? "View verification"
            : status === "NOT_SUBMITTED"
              ? "Submit verification"
              : "Manage verification"}{" "}
          →
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="font-semibold text-slate-900">
              {card.title}
            </h2>

            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
              {card.description}
            </p>

            {card.link ? (
              <Link
                to={card.link}
                className="mt-4 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                {card.action} →
              </Link>
            ) : (
              <span className="mt-4 inline-flex text-sm font-medium text-slate-400">
                {card.action}
              </span>
            )}
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
        <h2 className="font-semibold text-slate-900">
          Your next steps
        </h2>

        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm leading-6 text-slate-700">
          <li>Complete your student profile.</li>
          <li>Submit your university verification details.</li>
          <li>
            Once verified, you can apply for eligible GIGs when that
            feature becomes available.
          </li>
        </ol>
      </section>
    </div>
  );
}

export default StudentDashboard;