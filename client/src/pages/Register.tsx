import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Register() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    patronymic: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.lastName || !formData.firstName || !formData.email || !formData.password) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (formData.password.length < 8) {
      setError("Пароль должен быть не менее 8 символов");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement registration API call
      // For now, just redirect to login
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Ошибка при регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-[#2C353D] mb-2">Регистрация</h1>
          <p className="text-[#6E7A85] mb-6">Создайте аккаунт для сохранения памяти</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2C353D] mb-2">
                Фамилия *
              </label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Иванов"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C353D] mb-2">
                Имя *
              </label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Иван"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C353D] mb-2">
                Отчество
              </label>
              <Input
                type="text"
                name="patronymic"
                value={formData.patronymic}
                onChange={handleChange}
                placeholder="Иванович"
                className="w-full"
              />
            </div>

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
                placeholder="Минимум 8 символов"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C353D] mb-2">
                Подтвердите пароль *
              </label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Повторите пароль"
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold py-2"
            >
              {loading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </form>

          <p className="text-center text-[#6E7A85] text-sm mt-6">
            Уже есть аккаунт?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#C49F64] font-semibold hover:underline"
            >
              Войти
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
