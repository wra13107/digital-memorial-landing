import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Heart, Music, Image as ImageIcon, Video, Share2, Edit2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function MemorialPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [memorial, setMemorial] = useState<any>(null);
  const [candles, setCandles] = useState(0);
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [guestbookEntry, setGuestbookEntry] = useState("");

  // TODO: Load memorial data from API based on route parameter

  const handleLightCandle = () => {
    setCandles(candles + 1);
    // TODO: Send to API
  };

  const handleAddGuestbookEntry = () => {
    if (guestbookEntry.trim()) {
      // TODO: Send to API
      setGuestbookEntry("");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Мемориал ${memorial?.firstName} ${memorial?.lastName}`,
        text: "Посетите цифровой мемориал",
        url: window.location.href,
      });
    }
  };

  if (!memorial) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-[#6E7A85]">Загрузка...</p>
      </div>
    );
  }

  const isOwner = user?.id === memorial.userId;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section */}
      <section className="relative h-96 bg-[#F0F4F8] overflow-hidden">
        {memorial.mainPhoto && (
          <img
            src={memorial.mainPhoto}
            alt={`${memorial.firstName} ${memorial.lastName}`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFBF7]" />

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="text-[#C49F64] font-semibold hover:underline"
            >
              ← Вернуться
            </button>
            <div className="flex gap-2">
              <Button
                onClick={handleShare}
                variant="outline"
                className="border-[#C49F64] text-[#C49F64]"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Поделиться
              </Button>
              {isOwner && (
                <Button
                  onClick={() => navigate(`/edit-memorial/${memorial.id}`)}
                  className="bg-[#C49F64] hover:bg-[#b8934f] text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
              )}
            </div>
          </div>
        </header>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Memorial Info */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[#2C353D] mb-2">
            {memorial.firstName} {memorial.lastName}
          </h1>
          <p className="text-2xl text-[#6E7A85] mb-6">
            {memorial.birthDate} — {memorial.deathDate}
          </p>

          {/* Location */}
          {memorial.burialLocation && (
            <div className="flex items-start gap-3 mb-6">
              <MapPin className="w-6 h-6 text-[#C49F64] flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-[#2C353D]">{memorial.burialLocation}</p>
                {memorial.latitude && memorial.longitude && (
                  <p className="text-sm text-[#6E7A85]">
                    Координаты: {memorial.latitude}, {memorial.longitude}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Candle Counter */}
        <div className="mb-12 flex items-center gap-6">
          <Card className="p-6 flex items-center gap-4">
            <Heart className="w-8 h-8 text-[#C49F64]" />
            <div>
              <p className="text-sm text-[#6E7A85]">Зажжено свечей</p>
              <p className="text-3xl font-bold text-[#2C353D]">{candles}</p>
            </div>
          </Card>
          <Button
            onClick={handleLightCandle}
            className="bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold px-6 py-3"
          >
            <Heart className="w-5 h-5 mr-2" />
            Зажечь свечу
          </Button>
        </div>

        {/* Biography */}
        {memorial.biography && (
          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-bold text-[#2C353D] mb-4">Биография</h2>
            <p className="text-[#6E7A85] leading-relaxed whitespace-pre-wrap">
              {memorial.biography}
            </p>
          </Card>
        )}

        {/* Galleries */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Photo Gallery */}
          {memorial.photos && memorial.photos.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon className="w-6 h-6 text-[#C49F64]" />
                <h3 className="text-lg font-bold text-[#2C353D]">Фото</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {memorial.photos.slice(0, 4).map((photo: any, idx: number) => (
                  <img
                    key={idx}
                    src={photo.url}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
              {memorial.photos.length > 4 && (
                <p className="text-sm text-[#6E7A85] mt-2">
                  +{memorial.photos.length - 4} фото
                </p>
              )}
            </Card>
          )}

          {/* Video Gallery */}
          {memorial.videos && memorial.videos.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-6 h-6 text-[#C49F64]" />
                <h3 className="text-lg font-bold text-[#2C353D]">Видео</h3>
              </div>
              <p className="text-[#6E7A85]">{memorial.videos.length} видео</p>
            </Card>
          )}

          {/* Audio Gallery */}
          {memorial.audio && memorial.audio.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-6 h-6 text-[#C49F64]" />
                <h3 className="text-lg font-bold text-[#2C353D]">Аудио</h3>
              </div>
              <p className="text-[#6E7A85]">{memorial.audio.length} записей</p>
            </Card>
          )}
        </div>

        {/* Guestbook */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-[#2C353D] mb-6">Книга памяти</h2>

          {/* Add Entry */}
          <div className="mb-8">
            <textarea
              value={guestbookEntry}
              onChange={(e) => setGuestbookEntry(e.target.value)}
              placeholder="Напишите слова поддержки или воспоминание..."
              className="w-full p-4 border border-[#E8E8E8] rounded-lg focus:outline-none focus:border-[#C49F64]"
              rows={4}
            />
            <Button
              onClick={handleAddGuestbookEntry}
              disabled={!guestbookEntry.trim()}
              className="mt-4 bg-[#C49F64] hover:bg-[#b8934f] text-white"
            >
              Добавить запись
            </Button>
          </div>

          {/* Entries */}
          <div className="space-y-4">
            {/* TODO: Display guestbook entries */}
            <p className="text-[#6E7A85]">Записей нет</p>
          </div>
        </Card>
      </main>
    </div>
  );
}
