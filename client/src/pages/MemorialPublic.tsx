import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, Music, Play, X, Download, Volume2 } from "lucide-react";
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
  const allMedia = [...photos, ...videos];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="w-full bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          {/* Left Side - Dark Background with Name and Audio */}
          <div className="bg-[#1a1a1a] text-white p-8 lg:p-16 flex flex-col justify-center">
            <h1 className="text-5xl lg:text-6xl font-serif font-bold mb-12 leading-tight">
              {memorial.firstName}
              <br />
              {memorial.lastName}
            </h1>

            {/* Audio Player */}
            {audios.length > 0 && (
              <div className="space-y-6">
                {audios.slice(0, 1).map((audio) => (
                  <div key={audio.id} className="space-y-3">
                    <p className="text-sm font-medium text-gray-300">
                      {audio.title || "Story"}
                    </p>
                    <div className="bg-[#2a2a2a] rounded-full p-4 flex items-center gap-4">
                      <button className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C49F64] flex items-center justify-center hover:bg-[#b8934f] transition-colors">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </button>
                      <audio
                        src={audio.url}
                        controls
                        className="flex-1 h-8"
                        style={{
                          filter: "invert(1)",
                        }}
                      />
                      <button className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white">
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Main Photo */}
          {memorial.mainPhotoUrl && (
            <div className="bg-gray-300 overflow-hidden">
              <img
                src={memorial.mainPhotoUrl}
                alt={`${memorial.firstName} ${memorial.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Gold Divider */}
        <div className="h-2 bg-[#C49F64]"></div>
      </section>

      {/* Main Content */}
      <main className="py-16">
        {/* Personal Information Section */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <Card className="p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-[#2C353D] mb-8">Информация</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-[#2C353D] mb-2">ФИО</h3>
                <p className="text-[#6E7A85] text-lg">
                  {memorial.firstName} {memorial.lastName}
                  {memorial.patronymic && ` ${memorial.patronymic}`}
                </p>
              </div>

              {memorial.birthDate && (
                <div>
                  <h3 className="font-semibold text-[#2C353D] mb-2">Дата рождения</h3>
                  <p className="text-[#6E7A85] text-lg">
                    {new Date(memorial.birthDate).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              )}

              {memorial.deathDate && (
                <div>
                  <h3 className="font-semibold text-[#2C353D] mb-2">Дата смерти</h3>
                  <p className="text-[#6E7A85] text-lg">
                    {new Date(memorial.deathDate).toLocaleDateString("ru-RU")}
                  </p>
                </div>
              )}

              {memorial.burialPlace && (
                <div>
                  <h3 className="font-semibold text-[#2C353D] mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C49F64]" />
                    Место захоронения
                  </h3>
                  <p className="text-[#6E7A85] text-lg">{memorial.burialPlace}</p>
                </div>
              )}
            </div>

            {memorial.description && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-[#2C353D] mb-4">Биография</h3>
                <p className="text-[#6E7A85] whitespace-pre-wrap leading-relaxed">
                  {memorial.description}
                </p>
              </div>
            )}

            {memorial.epitaph && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-[#2C353D] mb-4">Эпитафия</h3>
                <p className="text-[#6E7A85] italic text-lg leading-relaxed">
                  "{memorial.epitaph}"
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Map Section */}
        {memorial.latitude && memorial.longitude && (
          <div className="max-w-6xl mx-auto px-4 mb-16">
            <Card className="overflow-hidden">
              <div className="p-8 lg:p-12">
                <h2 className="text-3xl font-bold text-[#2C353D] mb-8 flex items-center gap-2">
                  <MapPin className="w-8 h-8 text-[#C49F64]" />
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
          </div>
        )}

        {/* Media Gallery Section */}
        {allMedia.length > 0 && (
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#2C353D] mb-12">Галерея</h2>

            {/* Masonry-style Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-max">
              {allMedia.map((item, index) => {
                const isVideo = item.type === "video";
                // Create varied sizes: some items span 2 columns and 2 rows
                const isLarge = index % 7 === 0 || index % 7 === 3;
                const colSpan = isLarge ? "col-span-2" : "col-span-1";
                const rowSpan = isLarge ? "row-span-2" : "row-span-1";

                return (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden rounded-lg cursor-pointer bg-gray-300 ${colSpan} ${rowSpan} aspect-square`}
                    onClick={() => setSelectedMedia(item.url)}
                  >
                    {isVideo ? (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title || "Memorial photo"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      {isVideo && (
                        <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 fill-white" />
                      )}
                    </div>

                    {/* Video label */}
                    {isVideo && (
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                        {item.title || "Видео"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Audio Section */}
        {audios.length > 1 && (
          <div className="max-w-6xl mx-auto px-4 mt-16">
            <h2 className="text-3xl font-bold text-[#2C353D] mb-8 flex items-center gap-2">
              <Music className="w-8 h-8 text-[#C49F64]" />
              Аудиозаписи
            </h2>
            <div className="space-y-4">
              {audios.map((audio) => (
                <Card key={audio.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <button className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C49F64] flex items-center justify-center hover:bg-[#b8934f] transition-colors">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#2C353D] mb-2">
                        {audio.title || "Аудиозапись"}
                      </p>
                      <audio src={audio.url} controls className="w-full" />
                      {audio.description && (
                        <p className="text-sm text-[#6E7A85] mt-3">{audio.description}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {selectedMedia.endsWith(".mp4") || selectedMedia.endsWith(".webm") ? (
              <video
                src={selectedMedia}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={selectedMedia}
                alt="Full size"
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
