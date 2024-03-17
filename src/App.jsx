import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CompanyRegister from "./pages/auth/CompanyRegister";
import CompanyLogin from "./pages/auth/CompanyLogin";
import HomePage from "./pages/HomePage";
import Company from "./pages/company/Company";
import HomePage2 from "./pages/HomePage2";
import NewApplication from "./pages/company/NewApplication";
import Application from "./pages/company/Application";
import SupervisorRegister from "./pages/auth/SupervisorRegister";
import SupervisorLogin from "./pages/auth/SupervisorLogin";
import Supervisor from "./pages/supervisor/Supervisor";
import Companies from "./pages/supervisor/Companies";
import SupervisorPassword from "./pages/supervisor/SupervisorPassword";
import SupervisorProfile from "./pages/supervisor/SupervisorProfile";
import Students from "./pages/supervisor/Students";
import InternshipInfo from "./pages/supervisor/InternshipInfo";
import InternshipApplications from "./pages/supervisor/Application";
import StudentRegister from "./pages/auth/StudentRegister";
import InternshipAnnouncements from "./pages/student/InternshipAnnouncements";
import StudentInternships from "./pages/student/StudentInternships";
import StudentApplications from "./pages/student/StudentApplications";
import StudentPassword from "./pages/student/StudentPassword";
import StudentProfile from "./pages/student/StudentProfile";
import CompanyProfile from "./pages/company/CompanyProfile";
import CompanyPassword from "./pages/company/CompanyPassword";
import ApprovedApplication from "./pages/company/ApprovedApplication";
import StudentLogin from "./pages/auth/StudentLogin";
import Student from "./pages/student/Student"
import { useSelector } from "react-redux";
import PrivateRoute from "./pages/auth/PrivateRoute";


function App() {
  const userType = useSelector(state => state.auth.userType);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<HomePage2 />} />
          <Route path="/company/register" element={<CompanyRegister />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/supervisor/register" element={<SupervisorRegister />} />
          <Route path="/supervisor/login" element={<SupervisorLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/login" element={<StudentLogin />} />

          <Route
            path="/company"
            element={
              <PrivateRoute allowedUserTypes="Company">
                <Company />
              </PrivateRoute>
            }
          />
          <Route
            path="/company/profile"
            element={
              <PrivateRoute allowedUserTypes="Company">
                <CompanyProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/company/new"
            element={
              <PrivateRoute allowedUserTypes="Company">
                <NewApplication />
              </PrivateRoute>
            }
          />
          <Route
            path="/company/application"
            element={
              <PrivateRoute allowedUserTypes="Company">
                <Application />
              </PrivateRoute>
            }
          />
          <Route
            path="/company/password"
            element={
              <PrivateRoute allowedUserTypes="Company">
                <CompanyPassword />
              </PrivateRoute>
            }
          />
          <Route
            path="/company/approved"
            element={
              <PrivateRoute allowedUserTypes="Company">
                <ApprovedApplication />
              </PrivateRoute>
            }
          />

          <Route
            path="/supervisor"
            element={
              <PrivateRoute allowedUserTypes="Supervisor">
                <Supervisor />
              </PrivateRoute>
            }
          />
          <Route
            path="/supervisor/companies"
            element={
              <PrivateRoute allowedUserTypes="Supervisor">
                <Companies />
              </PrivateRoute>
            }
          />
          <Route
            path="/supervisor/password"
            element={
              <PrivateRoute allowedUserTypes="Supervisor">
                <SupervisorPassword />
              </PrivateRoute>
            }
          />
          <Route
            path="/supervisor/profile"
            element={
              <PrivateRoute allowedUserTypes="Supervisor">
                <SupervisorProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/supervisor/students"
            element={
              <PrivateRoute allowedUserTypes="Supervisor">
                <Students />
              </PrivateRoute>
            }
          />
          <Route
            path="/supervisor/internshipinfos"
            element={
              <PrivateRoute allowedUserTypes="Supervisor">
                <InternshipInfo />
              </PrivateRoute>
            }
          />
          <Route
            path="/supervisor/applications"
            element={
              <PrivateRoute allowedUserTypes="Supervisor">
                <InternshipApplications />
              </PrivateRoute>
            }
          />

          <Route
            path="/student/password"
            element={
              <PrivateRoute allowedUserTypes="Student">
                <StudentPassword />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <PrivateRoute allowedUserTypes="Student">
                <StudentProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/internships"
            element={
              <PrivateRoute allowedUserTypes="Student">
                <StudentInternships />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <PrivateRoute allowedUserTypes="Student">
                <StudentApplications />
              </PrivateRoute>
            }
          />
          <Route
            path="/student"
            element={
              <PrivateRoute allowedUserTypes="Student">
                <Student />
              </PrivateRoute>
            }
          />

          <Route
            path="/student/announcements"
            element={<PrivateRoute allowedUserTypes="Student" ><InternshipAnnouncements /></PrivateRoute>}
          />


        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;