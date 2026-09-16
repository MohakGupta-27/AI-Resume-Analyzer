import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { GuestRoute, ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AnalysisHistoryPage } from "./pages/AnalysisHistoryPage";
import { AnalysisResultPage } from "./pages/AnalysisResultPage";
import { AnalyzePage } from "./pages/AnalyzePage";
import { DashboardPage } from "./pages/DashboardPage";
import { JobDescriptionDetailPage, JobDescriptionListPage } from "./pages/JobDescriptionPages";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResumeDetailPage } from "./pages/ResumeDetailPage";
import { ResumeListPage } from "./pages/ResumeListPage";
import { ResumeUploadPage } from "./pages/ResumeUploadPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/resumes" element={<ResumeListPage />} />
              <Route path="/resumes/upload" element={<ResumeUploadPage />} />
              <Route path="/resumes/:id" element={<ResumeDetailPage />} />
              <Route path="/job-descriptions" element={<JobDescriptionListPage />} />
              <Route path="/job-descriptions/:id" element={<JobDescriptionDetailPage />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              <Route path="/analyses" element={<AnalysisHistoryPage />} />
              <Route path="/analyses/:id" element={<AnalysisResultPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
