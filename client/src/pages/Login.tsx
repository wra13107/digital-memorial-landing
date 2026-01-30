import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Login() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loginMutation = trpc.auth.login.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setLoading(true);
    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Вход успешен! Перенаправляю в личный кабинет...");
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.message || "Ошибка при входе";
      setError(errorMessage);
      console.error("[Login] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-[#2C353D] mb-2">Вход</h1>
          <p className="text-[#6E7A85] mb-6">Войдите в свой аккаунт</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C353D] mb-2">
                Email или логин *
              </label>
              <Input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com или Administrator"
                className="w-full"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C353D] mb-2">
                Пароль *
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ваш пароль"
                className="w-full"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || loginMutation.isPending}
              className="w-full bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold py-2"
            >
              {loading || loginMutation.isPending ? "Вход..." : "Войти"}
            </Button>
          </form>

          <p className="text-center text-[#6E7A85] text-sm mt-6">
            Забыли пароль?{" "}
            <a
              href="/forgot-password"
              className="text-[#C49F64] font-semibold hover:underline"
            >
              Сбросить пароль
            </a>
          </p>

          <p className="text-center text-[#6E7A85] text-sm mt-4">
            Нет аккаунта?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#C49F64] font-semibold hover:underline"
              disabled={loading}
            >
              Зарегистрироваться
            </button>
          </p>

          <p className="text-center text-[#6E7A85] text-sm mt-4">
            <button
              onClick={() => navigate("/")}
              className="text-[#C49F64] font-semibold hover:underline"
              disabled={loading}
            >
              Вернуться на главную
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
