import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import TopNavbar from "./components/TopNavbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfessorList from "./pages/ProfessorList";
import ProfessorDetail from "./pages/ProfessorDetail";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Departments from "./pages/Departments";
import Compare from "./pages/Compare";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-slate-50 text-slate-700">
            <TopNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex pt-14">
              <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
              <main className="flex-1 lg:ml-64 transition-all duration-300">
                <div className="p-4 lg:p-6">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/professors" element={<ProfessorList />} />
                    <Route
                      path="/professors/:id"
                      element={<ProfessorDetail />}
                    />
                    <Route path="/departments" element={<Departments />} />
                    <Route path="/compare" element={<Compare />} />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      }
                    />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
