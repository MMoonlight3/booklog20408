import { Route, Routes } from 'react-router-dom';
import Layout from './Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import JoinedPage from './pages/JoinedPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MyPage from './pages/MyPage.jsx';
import RecordFormPage from './pages/RecordFormPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="joined" element={<JoinedPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="mypage" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        <Route path="records/new" element={<ProtectedRoute><RecordFormPage /></ProtectedRoute>} />
        <Route path="records/:id/edit" element={<ProtectedRoute><RecordFormPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
