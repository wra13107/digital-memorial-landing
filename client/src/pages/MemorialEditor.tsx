import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { MapView } from "@/components/Map";

interface MemorialFormData {
  lastName: string;
  firstName: string;
  patronymic: string;
  birthDate: string;
  deathDate: string;
  burialPlace: string;
  latitude: string;
  longitude: string;
  description: string;
}

export default function MemorialEditor() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [memorialId, setMemorialId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 55.7558, lng: 37.6173 }); // Moscow default
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [formData, setFormData] = useState<MemorialFormData>({
    lastName: "",
    firstName: "",
    patronymic: "",
    birthDate: "",
    deathDate: "",
    burialPlace: "",
    latitude: "",
    longitude: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get memorial data if editing
  const { data: memorial } = trpc.memorials.getById.useQuery(
    { id: memorialId || 0 },
    { enabled: !!memorialId }
  );

  // Load memorial data into form
  useEffect(() => {
    if (memorial) {
      setFormData({
        lastName: memorial.lastName || "",
        firstName: memorial.firstName || "",
        patronymic: memorial.patronymic || "",
        birthDate: memorial.birthDate ? new Date(memorial.birthDate).toISOString().split("T")[0] : "",
        deathDate: memorial.deathDate ? new Date(memorial.deathDate).toISOString().split("T")[0] : "",
        burialPlace: memorial.burialPlace || "",
        latitude: memorial.latitude?.toString() || "",
        longitude: memorial.longitude?.toString() || "",
        description: memorial.description || "",
      });

      if (memorial.latitude && memorial.longitude) {
        const lat = parseFloat(memorial.latitude.toString());
        const lng = parseFloat(memorial.longitude.toString());
        setMapCenter({ lat, lng });
        setSelectedLocation({ lat, lng });
      }
    }
  }, [memorial]);

  const createMutation = trpc.memorials.create.useMutation();
  const updateMutation = trpc.memorials.update.useMutation();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Фамилия обязательна";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Имя обязательно";
    }
    if (!formData.birthDate) {
      newErrors.birthDate = "Дата рождения обязательна";
    }
    if (!formData.deathDate) {
      newErrors.deathDate = "Дата смерти обязательна";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      if (memorialId) {
        // Update existing memorial
        await updateMutation.mutateAsync({
          id: memorialId,
          lastName: formData.lastName,
          firstName: formData.firstName,
          patronymic: formData.patronymic || undefined,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
          deathDate: formData.deathDate ? new Date(formData.deathDate) : undefined,
          burialPlace: formData.burialPlace || undefined,
          latitude: formData.latitude || undefined,
          longitude: formData.longitude || undefined,
          description: formData.description || undefined,
        });
        navigate("/dashboard");
      } else {
        // Create new memorial
        const result = await createMutation.mutateAsync({
          lastName: formData.lastName,
          firstName: formData.firstName,
          patronymic: formData.patronymic || undefined,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
          deathDate: formData.deathDate ? new Date(formData.deathDate) : undefined,
          burialPlace: formData.burialPlace || undefined,
          latitude: formData.latitude || undefined,
          longitude: formData.longitude || undefined,
          description: formData.description || undefined,
        });
        if (result && typeof result === 'object' && 'id' in result) {
          navigate(`/memorial/${(result as any).id}`);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error saving memorial:", error);
      setErrors({ submit: "Ошибка при сохранении мемориала" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#E8E8E8]">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-[#F0F4F8] rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#C49F64]" />
          </button>
          <h1 className="text-3xl font-bold text-[#2C353D]">
            {memorialId ? "Редактировать мемориал" : "Создать мемориал"}
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-[#2C353D] mb-6">Личная информация</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                  Фамилия *
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Введите фамилию"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                  Имя *
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Введите имя"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* Patronymic */}
              <div>
                <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                  Отчество
                </label>
                <Input
                  type="text"
                  name="patronymic"
                  value={formData.patronymic}
                  onChange={handleInputChange}
                  placeholder="Введите отчество"
                />
              </div>
            </div>

            {/* Birth and Death Dates */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Birth Date */}
              <div>
                <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                  Дата рождения *
                </label>
                <Input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={errors.birthDate ? "border-red-500" : ""}
                />
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                )}
              </div>

              {/* Death Date */}
              <div>
                <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                  Дата смерти *
                </label>
                <Input
                  type="date"
                  name="deathDate"
                  value={formData.deathDate}
                  onChange={handleInputChange}
                  className={errors.deathDate ? "border-red-500" : ""}
                />
                {errors.deathDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.deathDate}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Burial Information Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-[#2C353D] mb-6">Место захоронения</h2>

            {/* Burial Place */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                Место захоронения
              </label>
              <Input
                type="text"
                name="burialPlace"
                value={formData.burialPlace}
                onChange={handleInputChange}
                placeholder="Например: Кладбище 'Новое', Москва"
              />
            </div>

            {/* Coordinates */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                  Широта
                </label>
                <Input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  placeholder="55.7558"
                  step="0.0001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                  Долгота
                </label>
                <Input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  placeholder="37.6173"
                  step="0.0001"
                />
              </div>
            </div>

            {/* Map */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#2C353D] mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C49F64]" />
                Выберите место на карте
              </label>
              <div className="h-96 rounded-lg overflow-hidden border border-[#E8E8E8]">
                <MapView
                  initialCenter={mapCenter}
                  initialZoom={13}
                  onMapReady={(map: any) => {
                    // Add click listener to map
                    map.addListener('click', (e: any) => {
                      handleMapClick(e.latLng.lat(), e.latLng.lng());
                    });
                  }}
                />
              </div>
              {selectedLocation && (
                <p className="text-sm text-[#6E7A85] mt-2">
                  Выбранное место: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              )}
            </div>
          </Card>

          {/* Biography Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-[#2C353D] mb-6">Биография</h2>

            <div>
              <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                Описание
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Напишите биографию, воспоминания или любую другую информацию о человеке..."
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-[#6E7A85] mt-2">
                Поддерживается форматирование текста
              </p>
            </div>
          </Card>

          {/* Error Message */}
          {errors.submit && (
            <Card className="p-4 bg-red-50 border-red-300">
              <p className="text-red-600">{errors.submit}</p>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              className="border-[#C49F64] text-[#C49F64] hover:bg-[#C49F64]/10"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сохранить мемориал"
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
