
import { useEffect, useState } from "react";
import api from "../../api/axios";

const initialForm = {
  company_name: "",
  description: "",
  website: "",
  industry: "",
  contact_person: "",
  contact_phone: "",
  business_address: "",
};

const fieldLabels = {
  company_name: "Company Name",
  description: "Company Description",
  website: "Website",
  industry: "Industry",
  contact_person: "Contact Person",
  contact_phone: "Contact Phone",
  business_address: "Business Address",
};

export default function BrandProfile() {
  const [form, setForm] = useState(initialForm);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileExists, setProfileExists] = useState(false);

  function updateForm(data) {
    setForm({
      company_name: data.company_name || "",
      description: data.description || "",
      website: data.website || "",
      industry: data.industry || "",
      contact_person: data.contact_person || "",
      contact_phone: data.contact_phone || "",
      business_address: data.business_address || "",
    });
  }

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/brand/profile/");
      setProfile(response.data);
      setProfileExists(true);
      updateForm(response.data);
    } catch (err) {
      if (
        err.response?.status === 404 &&
        err.response?.data?.detail === "Brand profile not found."
      ) {
        // The API endpoint exists, but this brand has no profile yet.
        setProfile(null);
        setProfileExists(false);
        setForm(initialForm);
        setError("");
      } else {
        setError(
          err.response?.data?.detail ||
            "Unable to load brand profile. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = profileExists
        ? await api.put("/brand/profile/", form)
        : await api.post("/brand/profile/", form);

      setProfile(response.data);
      setProfileExists(true);
      updateForm(response.data);

      setMessage(
        profileExists
          ? "Brand profile updated successfully."
          : "Company profile created successfully."
      );
    } catch (err) {
      const data = err.response?.data;

      if (data && typeof data === "object") {
        setError(
          Object.entries(data)
            .map(([key, value]) => {
              const detail = Array.isArray(value)
                ? value.join(" ")
                : typeof value === "object" && value !== null
                  ? JSON.stringify(value)
                  : String(value);

              return `${key}: ${detail}`;
            })
            .join(" | ")
        );
      } else {
        setError("Unable to save company profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleVerificationSubmit() {
    const confirmed = window.confirm(
      "Submit your brand verification request for admin review?"
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
    return <main style={styles.page}>Loading brand profile...</main>;
  }

  if (error && !profile && profileExists === false) {
    return (
      <main style={styles.page}>
        <p style={styles.error}>{error}</p>
        <button style={styles.button} onClick={loadProfile}>
          Retry
        </button>
      </main>
    );
  }

  const status = profile?.verification_status || "NOT_SUBMITTED";

  const canSubmit = [
    "NOT_SUBMITTED",
    "REJECTED",
    "RESUBMIT_REQUIRED",
  ].includes(status);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>BRAND PORTAL</p>
          <h1 style={styles.heading}>Company Profile</h1>
          <p style={styles.muted}>
            {profileExists
              ? "Manage your company information and verification."
              : "Create your company profile to get started."}
          </p>
        </div>

        <span style={styles.status}>
          {status.replaceAll("_", " ")}
        </span>
      </header>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {profile?.rejection_reason && (
        <section style={styles.notice}>
          <strong>Admin feedback</strong>
          <p>{profile.rejection_reason}</p>
        </section>
      )}

      <form onSubmit={handleSave} style={styles.card}>
        <h2 style={styles.subheading}>Company Information</h2>

        <div style={styles.grid}>
          {Object.entries(fieldLabels).map(([name, label]) => (
            <label key={name} style={styles.label}>
              {label}

              {name === "description" ||
              name === "business_address" ? (
                <textarea
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  rows={3}
                  style={styles.input}
                />
              ) : (
                <input
                  name={name}
                  type={name === "website" ? "url" : "text"}
                  value={form[name]}
                  onChange={handleChange}
                  required={name === "company_name"}
                  style={styles.input}
                />
              )}
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            ...styles.button,
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving
            ? "Saving..."
            : profileExists
              ? "Save Changes"
              : "Create Company Profile"}
        </button>
      </form>

      {profileExists && (
        <section style={styles.card}>
          <h2 style={styles.subheading}>Brand Verification</h2>

          <p style={styles.muted}>
            Current status:{" "}
            <strong>{status.replaceAll("_", " ")}</strong>
          </p>

          {status === "APPROVED" && (
            <p style={styles.success}>
              Your brand is verified. You cannot resubmit verification.
            </p>
          )}

          {["PENDING", "UNDER_REVIEW"].includes(status) && (
            <p style={styles.muted}>
              Your verification request is awaiting admin review.
            </p>
          )}

          {canSubmit && (
            <button
              type="button"
              onClick={handleVerificationSubmit}
              disabled={submitting}
              style={{
                ...styles.button,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Submitting..." : "Submit Verification"}
            </button>
          )}
        </section>
      )}
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
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  eyebrow: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.5px",
  },
  heading: { fontSize: "30px", margin: "8px 0" },
  subheading: { fontSize: "20px", marginTop: 0 },
  muted: { color: "#64748b", lineHeight: 1.6 },
  status: {
    padding: "8px 12px",
    borderRadius: "8px",
    background: "#e0f2fe",
    color: "#075985",
    fontSize: "13px",
    fontWeight: 700,
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 600,
  },
  input: {
    boxSizing: "border-box",
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    font: "inherit",
    fontWeight: 400,
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
  success: { color: "#166534", marginBottom: "16px" },
  error: { color: "#b91c1c", marginBottom: "16px" },
  notice: {
    padding: "16px",
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: "8px",
    marginBottom: "20px",
  },
};
