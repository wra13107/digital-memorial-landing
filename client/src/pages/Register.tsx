import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { CountrySelector } from "@/components/CountrySelector";
import { formatPhoneNumber, getPhonePlaceholder } from "@/lib/phoneFormatter";
import { trpc } from "@/lib/trpc";

export default function Register() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedCountry, setSelectedCountry] = useState("RU"); // Russia by default
  const [selectedDialCode, setSelectedDialCode] = useState("+7");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const registerMutation = trpc.auth.register.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === "phone") {
      formattedValue = formatPhoneNumber(value, selectedCountry);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleCountryChange = (countryCode: string, dialCode: string) => {
    setSelectedCountry(countryCode);
    setSelectedDialCode(dialCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.phone || !formData.password) {
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

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Пожалуйста, введите корректный email");
      return;
    }

    setLoading(true);
    try {
      await registerMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        countryCode: selectedCountry,
      });

      setSuccess("Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения адреса.");
      
      // Clear form
      setFormData({
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      
      // Redirect to verify-email page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.message || "Ошибка при регистрации";
      setError(errorMessage);
      console.error("[Register] Error:", err);
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

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">{success}</p>
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
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C353D] mb-2">
                Телефон *
              </label>
              <div className="flex gap-2">
                <div className="w-32">
                  <CountrySelector
                    selectedCountry={selectedCountry}
                    onCountryChange={handleCountryChange}
                    placeholder="Страна"
                  />
                </div>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={getPhonePlaceholder(selectedCountry)}
                  className="flex-1"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Код страны: {selectedDialCode}
              </p>
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || registerMutation.isPending}
              className="w-full bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold py-2"
            >
              {loading || registerMutation.isPending ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </form>

          <p className="text-center text-[#6E7A85] text-sm mt-6">
            Уже есть аккаунт?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#C49F64] font-semibold hover:underline"
              disabled={loading}
            >
              Войти
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
