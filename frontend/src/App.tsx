// src/App.tsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AuthLayout } from "./routeLayouts/AuthLayout";
import { AdminStaffAuthLayout } from "./routeLayouts/AdminStaffAuthLayout";

import Login from "./components/Login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import NotFound from "./utils/NotFound";
import ApplicantManagement from "./components/Admin/Applicant/ApplicantManagement";
import CompanyManagement from "./components/Admin/Company/CompanyManagement";
import OfferManagement from "./components/OfferManagement";
import FormationManagement from "./components/Admin/FormationManagement";
import CreateUser from "./components/CreateUser";
import ApplicantPage from "./components/Applicant/ApplicantPage";
import ApplicantTest from "./components/Applicant/ApplicantTest";
import Offers from "./components/Company/Offers";
import ManagerManagement from "./components/Admin/ManagerManagement";
import ResetPassword from "./components/ResetPassword";
import FormationStatistics from "./components/Admin/FormationStatistics";
import ApplicantMatches from "./components/Applicant/ApplicantMatches";
import CompanyTest from "./components/Company/CompanyTest";
import CompanyMatches from "./components/Company/CompanyMatches";
import CompanyPage from "./components/Company/CompanyPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Define routes that don't need layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/register-applicant/:token"
            element={<CreateUser type="applicant" />}
          />
          <Route
            path="/register-company/:token"
            element={<CreateUser type="company" />}
          />
          <Route path="/applicant/application" element={<ApplicantPage />} />
          <Route path="/applicant/test" element={<ApplicantTest />} />
          <Route path="/applicant/matches" element={<ApplicantMatches />} />
          <Route path="/company/matches" element={<CompanyMatches />} />
          <Route path="/company/offers" element={<Offers />} />
          <Route path="/company/page" element={<CompanyPage />} />
          <Route path="/test/:token" element={<CompanyTest />} />
          <Route
            path="/thanks-test"
            element={
              <div className="w-1/2 bg-base-200 p-4 justify-center items-center flex flex-col mx-auto mt-10">
                <p>Test soumis avec succès ✅</p>
              </div>
            }
          />

          <Route path="/" element={<AuthLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminStaffAuthLayout />}>
              <Route
                path="applicant-management"
                element={<ApplicantManagement />}
              />
              <Route
                path="company-management"
                element={<CompanyManagement />}
              />
              <Route path="offer-management" element={<OfferManagement />} />
              <Route
                path="formation-management"
                element={<FormationManagement />}
              />
              <Route
                path="manager-management"
                element={<ManagerManagement />}
              />
              <Route
                path="formation-statistics"
                element={<FormationStatistics />}
              />
            </Route>
          </Route>

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
