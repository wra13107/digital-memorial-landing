import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import MemorialPage from "./pages/MemorialPage";
import Profile from "./pages/Profile";
import MemorialEditor from "./pages/MemorialEditor";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./_core/hooks/useAuth";
import { AlertCircle } from "lucide-react";

function VerificationBanner() {
  const { user } = useAuth();

  if (!user || user.emailVerified) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          Пожалуйста, подтвердите ваш email адрес для создания мемориалов.
          <a href="/verify-email" className="font-semibold underline ml-2 hover:text-amber-900">
            Перейти к подтверждению
          </a>
        </p>
      </div>
    </div>
  );
}

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/admin">
        <ProtectedRoute requiredRole="admin">
          <AdminPanel />
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>
      <Route path="/memorial/:id" component={MemorialPage} />
      <Route path="/memorial-editor">
        <ProtectedRoute>
          <MemorialEditor />
        </ProtectedRoute>
      </Route>
      <Route path="/memorial-editor/:id">
        <ProtectedRoute>
          <MemorialEditor />
        </ProtectedRoute>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Initialize AOS on mount
function AOSInitializer() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, []);
  return null;
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <AOSInitializer />
            <VerificationBanner />
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
