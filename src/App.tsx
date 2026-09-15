import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { IntroLoader } from "./components/IntroLoader";
import { HomePage } from "./pages/HomePage";
import { ProjectPage } from "./pages/ProjectPage";
import { AdminPage } from "./pages/AdminPage";

export default function App() {
  return (
    <>
      <IntroLoader />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/admin" element={<Navigate to="/admin/profile" replace />} />
          <Route path="/admin/:tab" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
