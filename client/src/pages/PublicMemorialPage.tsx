import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Heart, Music, Image as ImageIcon, Video, Share2, Edit2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { MapView } from "@/components/Map";
import { SocialShare } from "@/components/SocialShare";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { toast } from "sonner";

export default function PublicMemorialPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/memorial/:id");
  const memorialId = params?.id ? parseInt(params.id) : null;

  const [candles, setCandles] = useState(0);
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [guestbookEntry, setGuestbookEntry] = useState("");
  const mapRef = useRef<google.maps.Map | null>(null);

  // Fetch public memorial data
  const { data: memorial, isLoading: memorialLoading } = trpc.memorials.getPublic.useQuery(
    { id: memorialId || 0 },
    { enabled: !!memorialId }
  );

  // Fetch public gallery items
  const { data: galleryItems, isLoading: galleryLoading } = trpc.memorials.getPublicGallery.useQuery(
    { memorialId: memorialId || 0 },
    { enabled: !!memorialId }
  );

  const handleLightCandle = () => {
    setCandles(candles + 1);
    toast.success("Свеча зажжена в память");
  };

  const handleAddGuestbookEntry = () => {
    if (guestbookEntry.trim()) {
      // TODO: Send to API
      setGuestbookEntry("");
      toast.success("Запись добавлена в книгу памяти");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Мемориал ${memorial?.firstName} ${memorial?.lastName}`,
        text: "Посетите цифровой мемориал",
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Ссылка скопирована в буфер обмена");
    }
  };

  const handleEdit = () => {
    if (user?.id === memorial?.userId && memorial?.id) {
      navigate(`/memorial-editor/${memorial.id}`);
    }
  };

  if (memorialLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-[#6E7A85]">Загрузка мемориала...</p>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-4">
        <p className="text-[#6E7A85]">Мемориал не найден</p>
        <Button onClick={() => navigate("/")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          На главную
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === memorial?.userId;
  const photoGallery = galleryItems?.filter((item) => item.type === "photo") || [];
  const videoGallery = galleryItems?.filter((item) => item.type === "video") || [];
  const audioGallery = galleryItems?.filter((item) => item.type === "audio") || [];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E8E8] sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#C49F64] hover:text-[#b8934f] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад
          </button>
          <div className="flex items-center gap-2">
            {memorial && (
              <SocialShare
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={`Мемориал ${memorial.firstName} ${memorial.lastName}`}
                description={memorial.description || undefined}
              />
            )}
            {isOwner && memorial?.id && (
              <Button size="sm" onClick={handleEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                Редактировать
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Hero Section with Main Photo */}
        <div className="max-w-4xl mx-auto mb-12">
          {memorial.mainPhotoUrl && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={memorial.mainPhotoUrl}
                alt={`${memorial.firstName} ${memorial.lastName}`}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Memorial Info Card */}
          <Card className="p-8 bg-white border border-[#E8E8E8] shadow-md">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-[#2C353D] mb-2">
                {memorial.lastName} {memorial.firstName} {memorial.patronymic}
              </h1>
              <p className="text-xl text-[#6E7A85]">
                {memorial.birthDate && new Date(memorial.birthDate).toLocaleDateString("ru-RU")} —{" "}
                {memorial.deathDate && new Date(memorial.deathDate).toLocaleDateString("ru-RU")}
              </p>
              
              {memorial.epitaph && (
                <div className="mt-6 pt-6 border-t border-[#E8E8E8]">
                  <p className="text-lg italic text-[#C49F64] font-semibold leading-relaxed">
                    {memorial.epitaph}
                  </p>
                </div>
              )}
            </div>

            {memorial.burialPlace && (
              <div className="flex items-start gap-3 mb-6 p-4 bg-[#F0F4F8] rounded-lg">
                <MapPin className="w-5 h-5 text-[#C49F64] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-[#2C353D]">Место захоронения</p>
                  <p className="text-[#6E7A85]">{memorial.burialPlace}</p>
                </div>
              </div>
            )}

            {memorial.description && (
              <div className="prose prose-sm max-w-none">
                <p className="text-[#6E7A85] leading-relaxed whitespace-pre-wrap">
                  {memorial.description}
                </p>
              </div>
            )}
          </Card>

          {/* QR Code Section */}
          <div className="mt-8">
            <QRCodeGenerator
              url={typeof window !== "undefined" ? window.location.href : ""}
              title="Поделиться мемориалом"
              size={200}
            />
          </div>
        </div>

        {/* Media Galleries and Guestbook */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="photos" className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Фото</span>
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Видео</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Music className="w-4 h-4" />
                <span className="hidden sm:inline">Аудио</span>
              </TabsTrigger>
              <TabsTrigger value="candles" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Свечи</span>
              </TabsTrigger>
            </TabsList>

            {/* Photo Gallery */}
            <TabsContent value="photos" className="mt-6">
              {photoGallery.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photoGallery.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={item.url}
                        alt={item.title || "Photo"}
                        className="w-full h-64 object-cover"
                      />
                      {item.title && (
                        <div className="p-3 bg-white">
                          <p className="font-semibold text-[#2C353D] text-sm">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-[#6E7A85] mt-1">{item.description}</p>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center bg-[#F0F4F8]">
                  <p className="text-[#6E7A85]">Фотографий нет</p>
                </Card>
              )}
            </TabsContent>

            {/* Video Gallery */}
            <TabsContent value="videos" className="mt-6">
              {videoGallery.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {videoGallery.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <video
                        controls
                        className="w-full h-96 bg-black"
                        src={item.url}
                      />
                      {item.title && (
                        <div className="p-4 bg-white">
                          <p className="font-semibold text-[#2C353D]">{item.title}</p>
                          {item.description && (
                            <p className="text-sm text-[#6E7A85] mt-2">{item.description}</p>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center bg-[#F0F4F8]">
                  <p className="text-[#6E7A85]">Видео нет</p>
                </Card>
              )}
            </TabsContent>

            {/* Audio Gallery */}
            <TabsContent value="audio" className="mt-6">
              {audioGallery.length > 0 ? (
                <div className="space-y-4">
                  {audioGallery.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <Music className="w-8 h-8 text-[#C49F64] flex-shrink-0 mt-2" />
                        <div className="flex-1 min-w-0">
                          {item.title && (
                            <p className="font-semibold text-[#2C353D]">{item.title}</p>
                          )}
                          {item.description && (
                            <p className="text-sm text-[#6E7A85] mt-1">{item.description}</p>
                          )}
                          <audio
                            controls
                            className="w-full mt-3"
                            src={item.url}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center bg-[#F0F4F8]">
                  <p className="text-[#6E7A85]">Аудиозаписей нет</p>
                </Card>
              )}
            </TabsContent>

            {/* Candles Section */}
            <TabsContent value="candles" className="mt-6">
              <Card className="p-8">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🕯️</div>
                  <p className="text-2xl font-bold text-[#2C353D] mb-2">
                    {candles} {candles === 1 ? "свеча" : "свеч"} зажжено
                  </p>
                  <p className="text-[#6E7A85] mb-6">
                    Зажгите виртуальную свечу в память о близком человеке
                  </p>
                  <Button
                    onClick={handleLightCandle}
                    className="bg-[#C49F64] hover:bg-[#b8934f] text-white"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Зажечь свечу
                  </Button>
                </div>

                {/* Guestbook */}
                <div className="mt-8 pt-8 border-t border-[#E8E8E8]">
                  <h3 className="text-lg font-bold text-[#2C353D] mb-4">Книга памяти</h3>
                  <div className="space-y-4">
                    <div>
                      <textarea
                        value={guestbookEntry}
                        onChange={(e) => setGuestbookEntry(e.target.value)}
                        placeholder="Напишите слова поддержки..."
                        className="w-full p-3 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C49F64] text-[#2C353D]"
                        rows={3}
                      />
                      <Button
                        onClick={handleAddGuestbookEntry}
                        className="mt-3 bg-[#C49F64] hover:bg-[#b8934f] text-white w-full"
                        disabled={!guestbookEntry.trim()}
                      >
                        Добавить запись
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Map Section */}
        {memorial.latitude && memorial.longitude && (
          <div className="max-w-4xl mx-auto mt-12">
            <Card className="overflow-hidden">
              <div className="p-6 bg-white border-b border-[#E8E8E8]">
                <h2 className="text-2xl font-bold text-[#2C353D] flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-[#C49F64]" />
                  Место захоронения на карте
                </h2>
              </div>
              <div className="h-96">
                <MapView
                  initialCenter={{
                    lat: parseFloat(memorial.latitude || "0"),
                    lng: parseFloat(memorial.longitude || "0"),
                  }}
                  initialZoom={15}
                  onMapReady={(map) => {
                    mapRef.current = map;
                    // Add marker at burial location
                    new google.maps.marker.AdvancedMarkerElement({
                      map,
                  position: {
                    lat: parseFloat(memorial.latitude || "0"),
                    lng: parseFloat(memorial.longitude || "0"),
                  },
                      title: `${memorial.firstName} ${memorial.lastName}`,
                    });
                  }}
                />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
