import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "admin";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#C49F64]" />
          <p className="text-[#6E7A85]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-[#2C353D] mb-4">Требуется вход</h1>
          <p className="text-[#6E7A85] mb-6">
            Пожалуйста, войдите в свой аккаунт, чтобы получить доступ к этой странице
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={() => navigate("/login")}
              className="bg-[#C49F64] hover:bg-[#b8934f] text-white"
            >
              Войти
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="outline"
              className="border-[#C49F64] text-[#C49F64]"
            >
              Зарегистрироваться
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-[#2C353D] mb-4">Доступ запрещен</h1>
          <p className="text-[#6E7A85] mb-6">
            У вас нет прав доступа к этой странице
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-[#C49F64] hover:bg-[#b8934f] text-white"
          >
            Вернуться на главную
          </Button>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
