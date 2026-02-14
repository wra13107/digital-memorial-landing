import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Music, Play, X, Download } from "lucide-react";
import { useState } from "react";
import { MapView } from "@/components/Map";
import { downloadQRCode } from "@/lib/qrCodeDownload";
import { toast } from "sonner";

interface MemorialPublicParams {
  id: string;
}

export default function MemorialPublic() {
  const params = useParams<MemorialPublicParams>();
  const memorialId = params?.id ? parseInt(params.id) : null;
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const { data: memorial, isLoading: memorialLoading } = trpc.memorials.getPublic.useQuery(
    { id: memorialId || 0 },
    { enabled: !!memorialId }
  );

  const { data: galleryItems, isLoading: galleryLoading } = trpc.memorials.getPublicGallery.useQuery(
    { memorialId: memorialId || 0 },
    { enabled: !!memorialId }
  );

  if (!memorialId) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#2C353D]">Мемориал не найден</h1>
        </div>
      </div>
    );
  }

  if (memorialLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6E7A85]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#2C353D]">Мемориал не найден</h1>
        </div>
      </div>
    );
  }

  const photos = galleryItems?.filter((item) => item.type === "photo") || [];
  const videos = galleryItems?.filter((item) => item.type === "video") || [];
  const audios = galleryItems?.filter((item) => item.type === "audio") || [];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-[#2C353D]">
            {memorial.firstName} {memorial.lastName}
          </h1>
        </div>
      </header>

      <main className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Photo */}
            {memorial.mainPhotoUrl && (
              <Card className="overflow-hidden">
                <div className="w-full h-96 bg-[#F0F4F8] overflow-hidden">
                  <img
                    src={memorial.mainPhotoUrl}
                    alt={`${memorial.firstName} ${memorial.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            )}

            {/* Personal Information */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#2C353D] mb-6">Информация</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[#2C353D]">ФИО</h3>
                  <p className="text-[#6E7A85]">
                    {memorial.firstName} {memorial.lastName}
                    {memorial.patronymic && ` ${memorial.patronymic}`}
                  </p>
                </div>

                {memorial.burialPlace && (
                  <div>
                    <h3 className="font-semibold text-[#2C353D] flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C49F64]" />
                      Место захоронения
                    </h3>
                    <p className="text-[#6E7A85]">{memorial.burialPlace}</p>
                  </div>
                )}

                {memorial.description && (
                  <div>
                    <h3 className="font-semibold text-[#2C353D]">Биография</h3>
                    <p className="text-[#6E7A85] whitespace-pre-wrap">{memorial.description}</p>
                  </div>
                )}

                {memorial.epitaph && (
                  <div>
                    <h3 className="font-semibold text-[#2C353D]">Эпитафия</h3>
                    <p className="text-[#6E7A85] italic">{memorial.epitaph}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Map Section */}
            {memorial.latitude && memorial.longitude && (
              <Card className="overflow-hidden">
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-[#2C353D] mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-[#C49F64]" />
                    Место захоронения
                  </h2>
                </div>
                <div className="w-full h-96">
                  <MapView
                    initialCenter={{
                      lat: parseFloat(memorial.latitude.toString()),
                      lng: parseFloat(memorial.longitude.toString()),
                    }}
                    initialZoom={15}
                    markerPosition={{
                      lat: parseFloat(memorial.latitude.toString()),
                      lng: parseFloat(memorial.longitude.toString()),
                    }}
                    markerTitle={`${memorial.firstName} ${memorial.lastName}`}
                  />
                </div>
              </Card>
            )}

            {/* Media Gallery */}
            {(photos.length > 0 || videos.length > 0 || audios.length > 0) && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-[#2C353D] mb-6">Медиа галерея</h2>

                {/* Photos */}
                {photos.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[#2C353D] mb-4">Фото</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="relative group cursor-pointer overflow-hidden rounded-lg"
                          onClick={() => setSelectedMedia(photo.url)}
                        >
                          <img
                            src={photo.url}
                            alt={photo.title || "Memorial photo"}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {videos.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-[#2C353D] mb-4">Видео</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {videos.map((video) => (
                        <div
                          key={video.id}
                          className="relative group cursor-pointer overflow-hidden rounded-lg"
                          onClick={() => setSelectedMedia(video.url)}
                        >
                          <video
                            src={video.url}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audio */}
                {audios.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#2C353D] mb-4 flex items-center gap-2">
                      <Music className="w-5 h-5 text-[#C49F64]" />
                      Аудио
                    </h3>
                    <div className="space-y-4">
                      {audios.map((audio) => (
                        <div key={audio.id} className="bg-[#F0F4F8] p-4 rounded-lg">
                          <p className="font-semibold text-[#2C353D] mb-2">
                            {audio.title || "Аудиозапись"}
                          </p>
                          <audio src={audio.url} controls className="w-full" />
                          {audio.description && (
                            <p className="text-sm text-[#6E7A85] mt-2">{audio.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            {memorial.latitude && memorial.longitude && (
              <Card className="overflow-hidden">
                <div className="h-64">
                  <MapView
                    initialCenter={{
                      lat: parseFloat(memorial.latitude),
                      lng: parseFloat(memorial.longitude),
                    }}
                    initialZoom={15}
                  />
                </div>
              </Card>
            )}

            {/* Share Button */}
            <Card className="p-6">
              <h3 className="font-semibold text-[#2C353D] mb-4">Поделиться</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    const url = window.location.href;
                    navigator.clipboard.writeText(url);
                    toast.success("Ссылка скопирована в буфер обмена");
                  }}
                  className="w-full bg-[#C49F64] hover:bg-[#b8934f] text-white"
                >
                  Копировать ссылку
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const fullName = `${memorial.lastName || ''} ${memorial.firstName || ''}`.trim();
                      await downloadQRCode(memorialId, fullName || `memorial-${memorialId}`);
                      toast.success("QR-код скачан успешно");
                    } catch (error) {
                      toast.error("Ошибка при скачивании QR-кода");
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Скачать QR-код
                </Button>
              </div>
            </Card>

            {/* Candle */}
            <Card className="p-6">
              <h3 className="font-semibold text-[#2C353D] mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Зажечь свечу
              </h3>
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={() => alert("Спасибо за вашу память")}
              >
                Зажечь виртуальную свечу
              </Button>
            </Card>
          </div>
        </div>
      </main>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>

            {selectedMedia.endsWith(".mp4") || selectedMedia.endsWith(".webm") ? (
              <video src={selectedMedia} controls autoPlay className="w-full h-full" />
            ) : (
              <img src={selectedMedia} alt="Full size" className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
