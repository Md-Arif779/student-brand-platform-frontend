
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-800",
    description:
      "Your request has been submitted and is waiting for admin review.",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "border-blue-200 bg-blue-50 text-blue-800",
    description: "Your documents are currently being reviewed.",
  },
  APPROVED: {
    label: "Approved",
    className: "border-green-200 bg-green-50 text-green-800",
    description: "Your student verification has been approved.",
  },
  REJECTED: {
    label: "Rejected",
    className: "border-red-200 bg-red-50 text-red-800",
    description:
      "Please review the admin feedback and correct your information before resubmitting.",
  },
  RESUBMIT_REQUIRED: {
    label: "Resubmission Required",
    className: "border-orange-200 bg-orange-50 text-orange-800",
    description:
      "The admin has requested updated information or documents.",
  },
  NOT_SUBMITTED: {
    label: "Not Submitted",
    className: "border-gray-200 bg-gray-50 text-gray-700",
    description: "Please submit your student verification information.",
  },
};

const INITIAL_FORM = {
  university: "",
  department: "",
  university_student_id: "",
  graduation_year: "",
  method: "STUDENT_ID",
  university_email: "",
  document: null,
};

export default function StudentVerification() {
  const [universities, setUniversities] = useState([]);
  const [verification, setVerification] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingUniversities, setLoadingUniversities] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoadingUniversities(true);
      setError("");

      const universityRequest = api
        .get(API_ENDPOINTS.STUDENT.UNIVERSITIES)
        .then((response) => {
          if (isMounted) {
            setUniversities(response.data.data || []);
          }
        })
        .catch(() => {
          if (isMounted) {
            setError(
              "Could not load universities. Please refresh the page."
            );
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoadingUniversities(false);
          }
        });

      const verificationRequest = api
        .get(API_ENDPOINTS.STUDENT.VERIFICATION)
        .then((response) => {
          if (isMounted) {
            setVerification(response.data.data || null);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(
              err.response?.data?.message ||
                "Could not load verification status. Please log in again."
            );
          }
        });

      await Promise.all([universityRequest, verificationRequest]);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: files ? files[0] || null : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (verification?.status === "APPROVED") {
      setError("Your verification is already approved.");
      return;
    }

    if (!form.university) {
      setError("Please select your university.");
      return;
    }

    if (!form.department.trim()) {
      setError("Please enter your department.");
      return;
    }

    if (!form.university_student_id.trim()) {
      setError("Please enter your university student ID.");
      return;
    }

    if (!form.graduation_year) {
      setError("Please enter your graduation year.");
      return;
    }

    if (
      (form.method === "STUDENT_ID" ||
        form.method === "ENROLLMENT_DOCUMENT") &&
      !form.document &&
      !verification?.document
    ) {
      setError(
        "Please select your student ID card or enrollment document."
      );
      return;
    }

    if (
      form.method === "UNIVERSITY_EMAIL" &&
      !form.university_email.trim()
    ) {
      setError("Please enter your university email.");
      return;
    }

    if (form.document && form.document.size > 5 * 1024 * 1024) {
      setError("The document must not exceed 5 MB.");
      return;
    }

    const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];

    if (form.document) {
      const extension = form.document.name
        .split(".")
        .pop()
        .toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        setError("Only PDF, JPG, JPEG, and PNG files are allowed.");
        return;
      }
    }

    const formData = new FormData();

    formData.append("university", form.university);
    formData.append("department", form.department.trim());
    formData.append(
      "university_student_id",
      form.university_student_id.trim()
    );
    formData.append("graduation_year", form.graduation_year);
    formData.append("method", form.method);
    formData.append("university_email", form.university_email.trim());

    if (form.document) {
      formData.append("document", form.document);
    }

    try {
      setLoading(true);

      const response = await api.post(
        API_ENDPOINTS.STUDENT.VERIFICATION,
        formData,
        {
          headers: {
            "Content-Type": undefined,
          },
        }
      );

      setVerification(response.data.data || null);

      setMessage(
        response.data.message ||
          "Verification request submitted successfully."
      );

      setForm((previous) => ({
        ...previous,
        document: null,
      }));
    } catch (err) {
      const responseData = err.response?.data;

      if (responseData && typeof responseData === "object") {
        const details = Object.entries(responseData)
          .map(([key, value]) => {
            const text = Array.isArray(value)
              ? value.join(" ")
              : typeof value === "string"
                ? value
                : JSON.stringify(value);

            return `${key}: ${text}`;
          })
          .join("\n");

        setError(details || "Verification request failed.");
      } else {
        setError(
          err.message ||
            "Could not connect to the server. Please check your backend."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const status =
    verification?.status || "NOT_SUBMITTED";

  const statusConfig =
    STATUS_CONFIG[status] || STATUS_CONFIG.NOT_SUBMITTED;

  const isApproved = status === "APPROVED";

  const canResubmit =
    !verification ||
    ["REJECTED", "RESUBMIT_REQUIRED"].includes(status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Student Verification
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Submit your university information to verify your student status.
        </p>

        {/* Verification Status */}
        <div
          className={`mt-6 rounded-lg border p-4 ${statusConfig.className}`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium opacity-80">
                University Verification Status
              </p>

              <h2 className="mt-1 text-xl font-bold">
                {statusConfig.label}
              </h2>
            </div>

            <span className="rounded-full border border-current px-3 py-1 text-xs font-semibold">
              {status.replaceAll("_", " ")}
            </span>
          </div>

          <p className="mt-3 text-sm">
            {statusConfig.description}
          </p>

          {verification?.university_name && (
            <p className="mt-3 text-sm">
              <strong>University:</strong>{" "}
              {verification.university_name}
            </p>
          )}

          {verification?.department && (
            <p className="mt-1 text-sm">
              <strong>Department:</strong>{" "}
              {verification.department}
            </p>
          )}

          {verification?.rejection_reason && (
            <div className="mt-4 rounded-lg border border-red-200 bg-white p-4 text-gray-800">
              <p className="font-semibold text-red-700">
                Admin Feedback
              </p>

              <p className="mt-2 whitespace-pre-line text-sm">
                {verification.rejection_reason}
              </p>
            </div>
          )}

          {verification?.submitted_at && (
            <p className="mt-3 text-xs opacity-75">
              Submitted:{" "}
              {new Date(verification.submitted_at).toLocaleString()}
            </p>
          )}

          {verification?.reviewed_at && (
            <p className="mt-1 text-xs opacity-75">
              Last reviewed:{" "}
              {new Date(verification.reviewed_at).toLocaleString()}
            </p>
          )}
        </div>

        {/* Success Message */}
        {message && (
          <div
            role="status"
            className="mt-5 whitespace-pre-line rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mt-5 whitespace-pre-line rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Approved State */}
        {isApproved ? (
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="font-semibold text-green-900">
              Verification Complete
            </h3>

            <p className="mt-2 text-sm text-green-800">
              Your student verification has been approved. You do not
              need to submit another request.
            </p>
          </div>
        ) : (
          <>
            {loadingUniversities ? (
              <p className="mt-6 text-gray-600">
                Loading universities...
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {canResubmit
                    ? "Verification Information"
                    : "Submitted Information"}
                </h3>

                {status === "PENDING" ||
                status === "UNDER_REVIEW" ? (
                  <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                    Your request is already submitted. If the backend
                    does not allow another submission while it is pending
                    or under review, wait for the admin's decision.
                  </p>
                ) : null}

                <div>
                  <label
                    htmlFor="university"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    University
                  </label>

                  <select
                    id="university"
                    name="university"
                    value={form.university}
                    onChange={handleChange}
                    required
                    disabled={!canResubmit || loading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                  >
                    <option value="">
                      Select your university
                    </option>

                    {universities.map((university) => (
                      <option
                        key={university.id}
                        value={university.id}
                      >
                        {university.name}
                      </option>
                    ))}
                  </select>

                  {universities.length === 0 && (
                    <p className="mt-1 text-sm text-amber-700">
                      No active universities found. Add one through
                      Django Admin.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="department"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Department
                  </label>

                  <input
                    id="department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="e.g. CSE"
                    required
                    disabled={!canResubmit || loading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="university_student_id"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    University Student ID
                  </label>

                  <input
                    id="university_student_id"
                    name="university_student_id"
                    value={form.university_student_id}
                    onChange={handleChange}
                    placeholder="Enter your student ID"
                    required
                    disabled={!canResubmit || loading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="graduation_year"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Graduation Year
                  </label>

                  <input
                    id="graduation_year"
                    name="graduation_year"
                    type="number"
                    min="2000"
                    max="2100"
                    value={form.graduation_year}
                    onChange={handleChange}
                    placeholder="e.g. 2027"
                    required
                    disabled={!canResubmit || loading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="method"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Verification Method
                  </label>

                  <select
                    id="method"
                    name="method"
                    value={form.method}
                    onChange={handleChange}
                    disabled={!canResubmit || loading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                  >
                    <option value="STUDENT_ID">
                      Student ID Card
                    </option>
                    <option value="UNIVERSITY_EMAIL">
                      University Email
                    </option>
                    <option value="ENROLLMENT_DOCUMENT">
                      Enrollment Document
                    </option>
                  </select>
                </div>

                {form.method === "UNIVERSITY_EMAIL" && (
                  <div>
                    <label
                      htmlFor="university_email"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      University Email
                    </label>

                    <input
                      id="university_email"
                      name="university_email"
                      type="email"
                      value={form.university_email}
                      onChange={handleChange}
                      placeholder="name@university.edu"
                      required
                      disabled={!canResubmit || loading}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      Entering an email submits it for review; this
                      form does not itself verify ownership of that email.
                    </p>
                  </div>
                )}

                {(form.method === "STUDENT_ID" ||
                  form.method === "ENROLLMENT_DOCUMENT") && (
                  <div>
                    <label
                      htmlFor="document"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Upload Document (PDF, JPG, PNG — max 5 MB)
                    </label>

                    <input
                      id="document"
                      name="document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                      required={!verification?.document}
                      disabled={!canResubmit || loading}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 disabled:bg-gray-100"
                    />

                    {form.document && (
                      <p className="mt-1 text-sm text-gray-600">
                        Selected: {form.document.name}
                      </p>
                    )}

                    {!form.document && verification?.document && (
                      <p className="mt-1 text-sm text-gray-600">
                        A document was previously uploaded. Select a
                        new file if you need to replace it.
                      </p>
                    )}
                  </div>
                )}

                {canResubmit && (
                  <button
                    type="submit"
                    disabled={loading || loadingUniversities}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Submitting..."
                      : verification
                        ? "Resubmit Verification"
                        : "Submit Verification"}
                  </button>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
