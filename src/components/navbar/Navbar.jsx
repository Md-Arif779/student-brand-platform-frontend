
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutSuccess } from "../../features/auth/authSlice";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive
      ? "text-blue-700"
      : "text-slate-600 hover:text-blue-700"
  }`;

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const role = String(user?.role || "")
    .trim()
    .toUpperCase();

  const dashboardPath =
    role === "BRAND"
      ? "/brand/dashboard"
      : role === "STUDENT"
        ? "/student/dashboard"
        : role === "ADMIN" || role === "SUPERUSER"
          ? "/admin/dashboard"
          : "/";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutSuccess());
    closeMenu();
    navigate("/login", { replace: true });
  };

  const renderRoleLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <NavLink
            to="/"
            end
            className={navLinkClass}
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <a
            href="/#how-it-works"
            className={navLinkClass({ isActive: false })}
            onClick={closeMenu}
          >
            How It Works
          </a>

          <a
            href="/#for-students"
            className={navLinkClass({ isActive: false })}
            onClick={closeMenu}
          >
            For Students
          </a>

          <a
            href="/#for-brands"
            className={navLinkClass({ isActive: false })}
            onClick={closeMenu}
          >
            For Brands
          </a>
        </>
      );
    }

    if (role === "STUDENT") {
      return (
        <>
          <NavLink
            to="/student/dashboard"
            end
            className={navLinkClass}
            onClick={closeMenu}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/student/profile"
            className={navLinkClass}
            onClick={closeMenu}
          >
            My Profile
          </NavLink>

          <NavLink
            to="/student/verification"
            className={navLinkClass}
            onClick={closeMenu}
          >
            Verification
          </NavLink>
        </>
      );
    }

    if (role === "BRAND") {
      return (
        <>
          <NavLink
            to="/brand/dashboard"
            end
            className={navLinkClass}
            onClick={closeMenu}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/brand/profile"
            className={navLinkClass}
            onClick={closeMenu}
          >
            Company Profile
          </NavLink>
        </>
      );
    }

    if (role === "ADMIN" || role === "SUPERUSER") {
      return (
        <NavLink
          to="/admin/dashboard"
          className={navLinkClass}
          onClick={closeMenu}
        >
          Admin Dashboard
        </NavLink>
      );
    }

    return null;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-lg font-bold text-white">
            S
          </span>

          <span className="text-sm font-bold tracking-tight text-slate-900 sm:text-lg">
            Student Brand Platform
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 lg:flex">
          {renderRoleLinks()}
        </div>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="max-w-32 truncate text-sm text-slate-500">
                {user?.first_name || user?.username || "Account"}
              </span>

              <Link
                to={dashboardPath}
                className="rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="rounded-lg border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50 md:hidden"
        >
          {menuOpen ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-5 shadow-lg lg:hidden">
          <div className="flex flex-col gap-5">
            {renderRoleLinks()}

            <div className="border-t border-slate-100 pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {user?.first_name || user?.username || "Account"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {role || "User"}
                    </p>
                  </div>

                  <Link
                    to={dashboardPath}
                    onClick={closeMenu}
                    className="rounded-lg bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    Open Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Log in
                  </Link>

                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="rounded-lg bg-blue-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
