
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  const role = user.role?.toUpperCase();

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    if (role === "BRAND") {
      return <Navigate to="/brand/dashboard" replace />;
    }

    if (role === "STUDENT") {
      return <Navigate to="/student/profile" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
