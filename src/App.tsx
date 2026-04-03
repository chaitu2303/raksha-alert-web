import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AlertsPage from "./pages/AlertsPage.tsx";
import ReportIncident from "./pages/ReportIncident.tsx";
import MapPage from "./pages/MapPage.tsx";
import Profile from "./pages/Profile.tsx";
import SupportChat from "./pages/SupportChat.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import PostAlert from "./pages/PostAlert.tsx";
import AdminReports from "./pages/AdminReports.tsx";
import AdminFeedback from "./pages/AdminFeedback.tsx";
import AdminAnalytics from "./pages/AdminAnalytics.tsx";
import AdminSettings from "./pages/AdminSettings.tsx";
import AdminUsers from "./pages/AdminUsers.tsx";
import TeamPage from "./pages/TeamPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import SafetyChatbot from "./components/SafetyChatbot.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
            <Route path="/dashboard/report" element={<ProtectedRoute><ReportIncident /></ProtectedRoute>} />
            <Route path="/dashboard/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/dashboard/support" element={<ProtectedRoute><SupportChat /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/admin/post-alert" element={<ProtectedRoute requireAdmin><PostAlert /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute requireAdmin><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/feedback" element={<ProtectedRoute requireAdmin><AdminFeedback /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <SafetyChatbot />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
