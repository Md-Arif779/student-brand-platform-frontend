
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand information */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                S
              </span>

              <span className="text-lg font-bold text-white">
                Student Brand Platform
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              Connecting students with brands through meaningful
              collaborations, creative projects, and real opportunities.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Platform
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/"
                  className="transition-colors hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/signup"
                  className="transition-colors hover:text-white"
                >
                  Get Started
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="transition-colors hover:text-white"
                >
                  Log In
                </Link>
              </li>
            </ul>
          </div>

          {/* Students */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              For Students
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/signup/student"
                  className="transition-colors hover:text-white"
                >
                  Join as a Student
                </Link>
              </li>

              <li>
                <Link
                  to="/student/profile"
                  className="transition-colors hover:text-white"
                >
                  Student Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/student/verification"
                  className="transition-colors hover:text-white"
                >
                  Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              For Brands
            </h3>

            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link
                  to="/signup/brand"
                  className="transition-colors hover:text-white"
                >
                  Join as a Brand
                </Link>
              </li>

              <li>
                <Link
                  to="/brand/profile"
                  className="transition-colors hover:text-white"
                >
                  Company Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/brand/dashboard"
                  className="transition-colors hover:text-white"
                >
                  Brand Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Student Brand Platform.
            All rights reserved.
          </p>

          <p>Built to connect students and brands.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
