import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Heart, MapPin, Music, Users, Share2, MessageCircle } from "lucide-react";
import { useState } from "react";

interface DemoProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DemoProfileModal({ open, onOpenChange }: DemoProfileModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FDFBF7] border-[#E8E8E8]">
        <DialogHeader className="sticky top-0 bg-[#FDFBF7] pb-4 border-b border-[#E8E8E8]">
          <DialogTitle className="text-2xl font-bold text-[#2C353D]">
            Пример профиля памяти
          </DialogTitle>
        </DialogHeader>

        {/* Profile Content */}
        <div className="space-y-8 pt-4">
          {/* Hero Section with Photo */}
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
            <img
              src="/images/hero-sunset-memorial.jpg"
              alt="Memorial profile hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">Иван Сергеевич Петров</h1>
              <p className="text-lg opacity-90">1952 — 2021</p>
              <p className="text-sm opacity-75 mt-2">Москва, Россия</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#F0F4F8] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#C49F64]">24</p>
              <p className="text-sm text-[#6E7A85]">Фотографии</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#C49F64]">5</p>
              <p className="text-sm text-[#6E7A85]">Видео</p>
            </div>
            <div className="bg-[#F0F4F8] rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-[#C49F64]">143</p>
              <p className="text-sm text-[#6E7A85]">Свечи зажжены</p>
            </div>
          </div>

          {/* Biography Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#2C353D]">О нём</h2>
            <p className="text-[#6E7A85] leading-relaxed">
              Иван Сергеевич был замечательным человеком, который посвятил свою жизнь семье и работе. Он был инженером, увлекался путешествиями и всегда был готов помочь друзьям. Его улыбка и доброта останутся в сердцах всех, кто его знал.
            </p>
            <p className="text-[#6E7A85] leading-relaxed">
              Он оставил после себя богатое наследие: троих детей, семерых внуков и множество воспоминаний о добрых делах и щедром сердце.
            </p>
          </div>

          {/* Audio Message */}
          <div className="bg-gradient-to-r from-[#C49F64]/10 to-[#C49F64]/5 rounded-lg p-6 border border-[#C49F64]/20">
            <h3 className="text-lg font-bold text-[#2C353D] mb-4 flex items-center gap-2">
              <Music className="w-5 h-5 text-[#C49F64]" />
              Голос Ивана
            </h3>
            <p className="text-sm text-[#6E7A85] mb-4">
              Послушайте рассказ о его жизни в его собственном голосе
            </p>
            
            {/* Audio Player */}
            <div className="flex items-center gap-4 bg-white rounded-lg p-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-[#C49F64] hover:bg-[#b8934f] text-white flex items-center justify-center transition-all"
              >
                {isPlaying ? (
                  <div className="w-2 h-2 bg-white rounded-sm" />
                ) : (
                  <div className="w-0 h-0 border-l-6 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1" />
                )}
              </button>
              
              {/* Waveform */}
              <div className="flex-1 flex items-center gap-1 h-8">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#C49F64] rounded-full transition-all"
                    style={{
                      height: `${Math.random() * 100}%`,
                      opacity: isPlaying ? 0.8 : 0.4,
                    }}
                  />
                ))}
              </div>
              
              <span className="text-sm text-[#6E7A85] font-semibold">2:34</span>
            </div>
          </div>

          {/* Location */}
          <div className="bg-[#F0F4F8] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#2C353D] mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C49F64]" />
              Место захоронения
            </h3>
            <div className="bg-white rounded-lg p-4 h-48 flex items-center justify-center border border-[#E8E8E8]">
              <div className="text-center">
                <p className="text-[#6E7A85] font-semibold">Кладбище "Мир"</p>
                <p className="text-sm text-[#6E7A85]">Москва, Россия</p>
                <p className="text-xs text-[#6E7A85] mt-2">Координаты: 55.7558° N, 37.6173° E</p>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#2C353D]">Галерея</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group"
                >
                  <img
                    src="/images/smartphone-memorial-interface.jpg"
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Family Connections */}
          <div className="bg-[#F0F4F8] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[#2C353D] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#C49F64]" />
              Семейные связи
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                <div className="w-10 h-10 rounded-full bg-[#C49F64]/20 flex items-center justify-center text-[#C49F64] font-bold">
                  М
                </div>
                <div>
                  <p className="font-semibold text-[#2C353D]">Мария Ивановна</p>
                  <p className="text-xs text-[#6E7A85]">Супруга</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                <div className="w-10 h-10 rounded-full bg-[#C49F64]/20 flex items-center justify-center text-[#C49F64] font-bold">
                  А
                </div>
                <div>
                  <p className="font-semibold text-[#2C353D]">Алексей Иванович</p>
                  <p className="text-xs text-[#6E7A85]">Сын</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg p-3">
                <div className="w-10 h-10 rounded-full bg-[#C49F64]/20 flex items-center justify-center text-[#C49F64] font-bold">
                  О
                </div>
                <div>
                  <p className="font-semibold text-[#2C353D]">Ольга Ивановна</p>
                  <p className="text-xs text-[#6E7A85]">Дочь</p>
                </div>
              </div>
            </div>
          </div>

          {/* Book of Memories */}
          <div className="bg-gradient-to-r from-[#C49F64]/10 to-[#C49F64]/5 rounded-lg p-6 border border-[#C49F64]/20">
            <h3 className="text-lg font-bold text-[#2C353D] mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#C49F64]" />
              Книга памяти
            </h3>
            <p className="text-sm text-[#6E7A85] mb-4">
              143 человека зажгли виртуальную свечу в память об Иване
            </p>
            
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {[
                { name: "Сергей К.", message: "Спасибо за все, что ты сделал для нас. Ты будешь в наших сердцах всегда." },
                { name: "Елена М.", message: "Светлая память. Ты был замечательным человеком." },
                { name: "Дмитрий П.", message: "Мой лучший друг. Скучаю по тебе каждый день." },
              ].map((tribute, i) => (
                <div key={i} className="bg-white rounded-lg p-3 border border-[#E8E8E8]">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#C49F64]/20 flex items-center justify-center text-[#C49F64] text-xs font-bold flex-shrink-0">
                      {tribute.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#2C353D]">{tribute.name}</p>
                      <p className="text-xs text-[#6E7A85] leading-relaxed">{tribute.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Button className="w-full mt-4 bg-[#C49F64] hover:bg-[#b8934f] text-white">
              <Heart className="w-4 h-4 mr-2" />
              Зажечь свечу и написать сообщение
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pb-4">
            <Button variant="outline" className="border-[#C49F64] text-[#C49F64] hover:bg-[#C49F64] hover:text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Поделиться
            </Button>
            <Button className="bg-[#C49F64] hover:bg-[#b8934f] text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              Написать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
