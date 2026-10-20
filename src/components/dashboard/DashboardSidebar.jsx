
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const linkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-blue-50 text-blue-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

function DashboardSidebar() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role?.toUpperCase();

  const links =
    role === "BRAND"
      ? [
          { label: "Dashboard", to: "/brand/dashboard", end: true },
          { label: "Company Profile", to: "/brand/profile" },
          { label: "Verification", to: "/brand/verification" },
        ]
      : [
          { label: "Dashboard", to: "/student/dashboard", end: true },
          { label: "My Profile", to: "/student/profile" },
          { label: "University Verification", to: "/student/verification" },
        ];

  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
      <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Workspace
      </p>

      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            end={link.end}
            className={linkClass}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default DashboardSidebar;
