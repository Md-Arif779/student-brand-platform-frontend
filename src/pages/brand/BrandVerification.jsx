
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const statusMessages = {
  NOT_SUBMITTED: "Your brand verification request has not been submitted yet.",
  PENDING: "Your verification request is waiting for review.",
  UNDER_REVIEW: "The admin team is currently reviewing your company.",
  APPROVED: "Your company has been verified successfully.",
  REJECTED: "Your verification request was rejected. Review the admin feedback before resubmitting.",
  RESUBMIT_REQUIRED:
    "Please review the admin feedback and submit your verification request again.",
};

const statusColors = {
  NOT_SUBMITTED: { background: "#f1f5f9", color: "#334155" },
  PENDING: { background: "#fef3c7", color: "#92400e" },
  UNDER_REVIEW: { background: "#dbeafe", color: "#1d4ed8" },
  APPROVED: { background: "#dcfce7", color: "#166534" },
  REJECTED: { background: "#fee2e2", color: "#991b1b" },
  RESUBMIT_REQUIRED: { background: "#ffedd5", color: "#9a3412" },
};

export default function BrandVerification() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/brand/profile/");
      setProfile(response.data);
    } catch (err) {
      if (
        err.response?.status === 404 &&
        err.response?.data?.detail === "Brand profile not found."
      ) {
        setProfile(null);
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load verification status. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSubmit() {
    const confirmed = window.confirm(
      "Submit your company verification request for admin review?"
    );

    if (!confirmed) return;

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await api.post("/brand/verification/", {});
      setMessage("Verification request submitted successfully.");
      await loadProfile();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to submit verification request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main style={styles.page}>
        <p style={styles.muted}>Loading verification status...</p>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main style={styles.page}>
        <h1 style={styles.heading}>Brand Verification</h1>
        <p style={styles.error}>{error}</p>

        <button style={styles.button} onClick={loadProfile}>
          Retry
        </button>
      </main>
    );
  }

  if (!profile) {
    return (
      <main style={styles.page}>
        <h1 style={styles.heading}>Brand Verification</h1>

        <section style={styles.card}>
          <h2 style={styles.subheading}>Company Profile Required</h2>

          <p style={styles.muted}>
            Create your company profile before submitting a verification
            request.
          </p>

          <Link to="/brand/profile" style={styles.linkButton}>
            Create Company Profile
          </Link>
        </section>
      </main>
    );
  }

  const status = profile.verification_status || "NOT_SUBMITTED";

  const canSubmit = [
    "NOT_SUBMITTED",
    "REJECTED",
    "RESUBMIT_REQUIRED",
  ].includes(status);

  const statusStyle = statusColors[status] || {
    background: "#f1f5f9",
    color: "#334155",
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>BRAND PORTAL</p>
          <h1 style={styles.heading}>Brand Verification</h1>
          <p style={styles.muted}>
            Track your company verification request and admin feedback.
          </p>
        </div>

        <span
          style={{
            ...styles.status,
            ...statusStyle,
          }}
        >
          {status.replaceAll("_", " ")}
        </span>
      </header>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      <section style={styles.card}>
        <h2 style={styles.subheading}>Company Details</h2>

        <div style={styles.details}>
          <div>
            <span style={styles.detailLabel}>Company Name</span>
            <p style={styles.detailValue}>
              {profile.company_name || "Not provided"}
            </p>
          </div>

          <div>
            <span style={styles.detailLabel}>Industry</span>
            <p style={styles.detailValue}>
              {profile.industry || "Not provided"}
            </p>
          </div>

          <div>
            <span style={styles.detailLabel}>Contact Person</span>
            <p style={styles.detailValue}>
              {profile.contact_person || "Not provided"}
            </p>
          </div>

          <div>
            <span style={styles.detailLabel}>Contact Phone</span>
            <p style={styles.detailValue}>
              {profile.contact_phone || "Not provided"}
            </p>
          </div>
        </div>

        <Link to="/brand/profile" style={styles.textLink}>
          Edit Company Profile
        </Link>
      </section>

      <section style={styles.card}>
        <h2 style={styles.subheading}>Verification Status</h2>

        <p style={styles.muted}>
          {statusMessages[status] ||
            "Please contact the administrator for information about your verification status."}
        </p>

        {profile.rejection_reason && (
          <div style={styles.notice}>
            <strong>Admin Feedback</strong>
            <p style={styles.feedback}>{profile.rejection_reason}</p>
          </div>
        )}

        {status === "APPROVED" && (
          <p style={styles.success}>
            Your company is verified. No further submission is required.
          </p>
        )}

        {["PENDING", "UNDER_REVIEW"].includes(status) && (
          <p style={styles.muted}>
            Please wait for the administrator to review your request.
          </p>
        )}

        {canSubmit && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              ...styles.button,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting
              ? "Submitting..."
              : status === "NOT_SUBMITTED"
                ? "Submit Verification"
                : "Resubmit Verification"}
          </button>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "32px 20px",
    color: "#1f2937",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },
  eyebrow: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.5px",
  },
  heading: {
    fontSize: "30px",
    margin: "8px 0",
  },
  subheading: {
    fontSize: "20px",
    marginTop: 0,
  },
  muted: {
    color: "#64748b",
    lineHeight: 1.7,
  },
  status: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 700,
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
  },
  details: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  detailLabel: {
    color: "#64748b",
    fontSize: "13px",
  },
  detailValue: {
    margin: "6px 0 0",
    fontWeight: 600,
    overflowWrap: "anywhere",
  },
  notice: {
    padding: "16px",
    margin: "20px 0",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "8px",
  },
  feedback: {
    marginBottom: 0,
    lineHeight: 1.6,
  },
  button: {
    padding: "11px 18px",
    border: 0,
    borderRadius: "7px",
    background: "#1d4ed8",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  linkButton: {
    display: "inline-block",
    padding: "11px 18px",
    borderRadius: "7px",
    background: "#1d4ed8",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
  },
  textLink: {
    color: "#1d4ed8",
    fontWeight: 600,
    textDecoration: "none",
  },
  success: {
    color: "#166534",
    lineHeight: 1.6,
  },
  error: {
    color: "#b91c1c",
    lineHeight: 1.6,
  },
};
