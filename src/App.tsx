import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Toaster } from './components/ui/toaster';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { PlannerPage } from './pages/PlannerPage';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route — Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes — wrapped in app shell */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div
                className="h-screen text-foreground p-3 sm:p-4 font-sans selection:bg-secondary/30 flex justify-center overflow-hidden bg-cover bg-center bg-no-repeat relative"
                style={{ backgroundImage: "url('/src/assets/login-bg.png')" }}
              >
                {/* Subtle frosted overlay over the background to keep content legible */}
                <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl z-0 pointer-events-none" />

                {/* Main App Container — fills viewport exactly, no scrollbar */}
                <div className="w-full max-w-[1500px] h-full bg-white/60 backdrop-blur-xl rounded-[28px] shadow-2xl shadow-secondary/20 flex overflow-hidden border border-white/60 relative z-10">

                  {/* Left Navigation Pillar */}
                  <div className="flex-shrink-0 w-[72px] border-r border-white/40 flex flex-col items-center py-4 z-10 bg-white/40 relative">
                    <Sidebar />
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 flex flex-col h-full min-h-0 bg-transparent relative overflow-hidden">
                    {/* Subtle Background Glow */}
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-100/30 rounded-full blur-[100px] pointer-events-none" />

                    {/* Header */}
                    <div className="shrink-0 px-6 z-20">
                      <Header />
                    </div>

                    {/* Page Content — fills remaining space, no scroll */}
                    <div className="flex-1 min-h-0 px-6 pb-4 z-10">
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/planner" element={<PlannerPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </div>
                  </div>

                </div>
                <Toaster />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
