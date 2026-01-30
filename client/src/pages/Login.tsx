import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (!formData.email || !formData.password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement login API call
      // For now, just redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Ошибка при входе");
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C353D] mb-2">
                Email *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full"
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
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold py-2"
            >
              {loading ? "Вход..." : "Войти"}
            </Button>
          </form>

          <p className="text-center text-[#6E7A85] text-sm mt-6">
            Нет аккаунта?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-[#C49F64] font-semibold hover:underline"
            >
              Зарегистрироваться
            </button>
          </p>

          <p className="text-center text-[#6E7A85] text-sm mt-4">
            <button
              onClick={() => navigate("/")}
              className="text-[#C49F64] font-semibold hover:underline"
            >
              Вернуться на главную
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
