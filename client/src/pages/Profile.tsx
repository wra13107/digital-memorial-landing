import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Edit2, X, Save, Loader2, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { NoindexHead } from "@/components/NoindexHead";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";

export default function Profile() {
  return (
    <>
      <NoindexHead />
      <ProfileContent />
    </>
  );
}

function ProfileContent() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    patronymic: "",
    birthDate: "",
    deathDate: "",
  });

  // Fetch user profile
  const profileQuery = trpc.auth.profile.useQuery(undefined, {
    enabled: !authLoading && !!user,
  });

  // Update profile mutation
  const updateProfileMutation = trpc.auth.updateProfile.useMutation();

  // Delete account mutation
  const deleteAccountMutation = trpc.auth.deleteAccount.useMutation();

  // Initialize form with user data
  useEffect(() => {
    if (profileQuery.data) {
      setFormData({
        firstName: profileQuery.data.firstName || "",
        lastName: profileQuery.data.lastName || "",
        patronymic: profileQuery.data.patronymic || "",
        birthDate: profileQuery.data.birthDate
          ? new Date(profileQuery.data.birthDate).toISOString().split("T")[0]
          : "",
        deathDate: profileQuery.data.deathDate
          ? new Date(profileQuery.data.deathDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [profileQuery.data]);

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

    if (!formData.firstName || !formData.lastName) {
      setError("Фамилия и имя обязательны");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        firstName: formData.firstName,
        lastName: formData.lastName,
        patronymic: formData.patronymic || undefined,
        birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
        deathDate: formData.deathDate ? new Date(formData.deathDate) : undefined,
      });

      setSuccess("Профиль успешно обновлен");
      setIsEditing(false);

      // Refresh profile data
      await profileQuery.refetch();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      const errorMessage = err?.message || "Ошибка при обновлении профиля";
      setError(errorMessage);
      console.error("[Profile] Update error:", err);
    }
  };

  if (authLoading || profileQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#C49F64]" />
          <p className="text-[#6E7A85]">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-[#2C353D]">Мой профиль</h1>
          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="border-[#C49F64] text-[#C49F64]"
          >
            Вернуться в кабинет
          </Button>
        </div>

        <Card className="shadow-lg">
          <div className="p-8">
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

            {!isEditing ? (
              // View Mode
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#6E7A85] mb-2">
                      Фамилия
                    </label>
                    <p className="text-lg text-[#2C353D] font-semibold">
                      {formData.lastName || "—"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#6E7A85] mb-2">
                      Имя
                    </label>
                    <p className="text-lg text-[#2C353D] font-semibold">
                      {formData.firstName || "—"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#6E7A85] mb-2">
                      Отчество
                    </label>
                    <p className="text-lg text-[#2C353D]">
                      {formData.patronymic || "—"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#6E7A85] mb-2">
                      Email
                    </label>
                    <p className="text-lg text-[#2C353D]">
                      {profileQuery.data?.email || "—"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#6E7A85] mb-2">
                      Дата рождения
                    </label>
                    <p className="text-lg text-[#2C353D]">
                      {formData.birthDate
                        ? new Date(formData.birthDate).toLocaleDateString("ru-RU")
                        : "—"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#6E7A85] mb-2">
                      Дата смерти
                    </label>
                    <p className="text-lg text-[#2C353D]">
                      {formData.deathDate
                        ? new Date(formData.deathDate).toLocaleDateString("ru-RU")
                        : "—"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#6E7A85] mb-2">
                    Роль
                  </label>
                  <p className="text-lg text-[#2C353D]">
                    {profileQuery.data?.role === "admin" ? "Администратор" : "Пользователь"}
                  </p>
                </div>

                <Button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold py-2 flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Редактировать профиль
                </Button>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      disabled={updateProfileMutation.isPending}
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
                      disabled={updateProfileMutation.isPending}
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
                      disabled={updateProfileMutation.isPending}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C353D] mb-2">
                      Дата рождения
                    </label>
                    <Input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="w-full"
                      disabled={updateProfileMutation.isPending}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2C353D] mb-2">
                      Дата смерти
                    </label>
                    <Input
                      type="date"
                      name="deathDate"
                      value={formData.deathDate}
                      onChange={handleChange}
                      className="w-full"
                      disabled={updateProfileMutation.isPending}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="flex-1 bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold py-2 flex items-center justify-center gap-2"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Сохранить
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setError("");
                    }}
                    variant="outline"
                    className="flex-1 border-[#C49F64] text-[#C49F64] font-semibold py-2 flex items-center justify-center gap-2"
                    disabled={updateProfileMutation.isPending}
                  >
                    <X className="w-4 h-4" />
                    Отмена
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>

        {/* Delete Account Section */}
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-600 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              onClick={() => setDeleteDialogOpen(true)}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </div>
        </Card>
      </div>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
}
