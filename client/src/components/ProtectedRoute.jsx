import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-message">로그인 정보를 확인하고 있습니다...</div>;
  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
