import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { StudentProvider } from './context/StudentContext.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { StudentCreatePage } from './pages/StudentCreatePage.jsx';
import { StudentDetailPage } from './pages/StudentDetailPage.jsx';
import { StudentEditPage } from './pages/StudentEditPage.jsx';
import { StudentsListPage } from './pages/StudentsListPage.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StudentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students"
                element={
                  <ProtectedRoute>
                    <StudentsListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/new"
                element={
                  <ProtectedRoute>
                    <StudentCreatePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/:id"
                element={
                  <ProtectedRoute>
                    <StudentDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/students/:id/edit"
                element={
                  <ProtectedRoute>
                    <StudentEditPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </StudentProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
