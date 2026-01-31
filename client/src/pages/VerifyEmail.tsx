import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function VerifyEmail() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const email = params.get("email") || "";
  const token = params.get("token") || "";

  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [status, setStatus] = useState<"loading" | "success" | "error" | "input">("input");

  const verifyEmailMutation = trpc.auth.verifyEmail.useMutation();
  const resendVerificationMutation = trpc.auth.resendVerificationEmail.useMutation();

  // If token is provided in URL, auto-verify
  useEffect(() => {
    if (token && email) {
      handleAutoVerify();
    }
  }, [token, email]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleAutoVerify = async () => {
    if (!token || !email) return;

    setLoading(true);
    try {
      await verifyEmailMutation.mutateAsync({
        email,
        token,
      });

      setStatus("success");
      setSuccess("Email успешно подтвержден! Перенаправляем вас...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Ошибка при подтверждении email");
      console.error("[VerifyEmail] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email не найден. Пожалуйста, зарегистрируйтесь снова.");
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      setError("Пожалуйста, введите 6-значный код подтверждения");
      return;
    }

    setLoading(true);
    try {
      await verifyEmailMutation.mutateAsync({
        email,
        token: verificationCode,
      });

      setStatus("success");
      setSuccess("Email успешно подтвержден! Перенаправляем вас...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Неверный код подтверждения");
      console.error("[VerifyEmail] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Email не найден. Пожалуйста, зарегистрируйтесь снова.");
      return;
    }

    setResendLoading(true);
    setError("");
    setSuccess("");

    try {
      await resendVerificationMutation.mutateAsync({ email });
      setSuccess("Код подтверждения отправлен на ваш email");
      setResendCountdown(60);
    } catch (err: any) {
      setError(err?.message || "Ошибка при отправке кода");
      console.error("[VerifyEmail] Error:", err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <div className="p-8">
          {status === "loading" && (
            <div className="text-center space-y-6">
              <Loader2 className="w-16 h-16 mx-auto text-[#C49F64] animate-spin" />
              <h1 className="text-2xl font-bold text-[#2C353D]">Проверка Email</h1>
              <p className="text-[#6E7A85]">Пожалуйста, подождите...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-6">
              <CheckCircle2 className="w-16 h-16 mx-auto text-green-500" />
              <h1 className="text-2xl font-bold text-[#2C353D]">Email Подтвержден!</h1>
              <p className="text-[#6E7A85]">{success}</p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold"
              >
                Перейти к входу
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center space-y-6">
              <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
              <h1 className="text-2xl font-bold text-[#2C353D]">Ошибка Подтверждения</h1>
              <p className="text-[#6E7A85]">{error}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate("/register")}
                  className="w-full bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold"
                >
                  Зарегистрироваться Снова
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="w-full border-[#C49F64] text-[#C49F64]"
                >
                  Вернуться к входу
                </Button>
              </div>
            </div>
          )}

          {status === "input" && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#C49F64]/20 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-[#C49F64]" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-[#2C353D] mb-2 text-center">
                Подтвердите Email
              </h1>
              <p className="text-[#6E7A85] mb-6 text-center">
                Мы отправили код подтверждения на<br />
                <span className="font-semibold text-[#2C353D]">{email || "ваш email"}</span>
              </p>

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
                    Код подтверждения *
                  </label>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setVerificationCode(value);
                    }}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full text-center text-2xl tracking-widest font-mono"
                    disabled={loading}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Введите 6-значный код из письма
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold py-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Проверка...
                    </>
                  ) : (
                    "Подтвердить Email"
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-[#6E7A85] mb-4">
                  Не получили код?
                </p>
                <Button
                  type="button"
                  variant="outline"
                  disabled={resendLoading || resendCountdown > 0}
                  onClick={handleResendCode}
                  className="w-full"
                >
                  {resendLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : resendCountdown > 0 ? (
                    `Повторить через ${resendCountdown}с`
                  ) : (
                    "Отправить код снова"
                  )}
                </Button>
              </div>

              <p className="text-center text-[#6E7A85] text-xs mt-6">
                Или{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="text-[#C49F64] font-semibold hover:underline"
                >
                  вернуться к регистрации
                </button>
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
