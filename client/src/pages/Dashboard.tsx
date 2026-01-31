import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, LogOut, Image, Video, Music } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { MediaUpload } from "@/components/MediaUpload";
import { MediaGallery } from "@/components/MediaGallery";
import { NoindexHead } from "@/components/NoindexHead";


export default function Dashboard() {
  return (
    <>
      <NoindexHead />
      <DashboardContent />
    </>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [memorials, setMemorials] = useState<any[]>([]);

  // Fetch gallery items - requires memorialId, so we'll skip for now
  const { data: galleryItems = [] } = trpc.memorials.getGalleryItems.useQuery(
    { memorialId: 0 },
    { enabled: false }
  );

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleCreateMemorial = () => {
    navigate("/memorial-editor");
  };

  const handleEditMemorial = (id: string) => {
    navigate(`/memorial-editor/${id}`);
  };

  const handleDeleteMemorial = (id: string) => {
    // TODO: Implement delete API call
    setMemorials(memorials.filter(m => m.id !== id));
  };

  const handleMediaUploadSuccess = () => {
    // Show success message
    console.log("Media uploaded successfully");
  };

  const handleMediaDeleteSuccess = () => {
    // Show success message
    console.log("Media deleted successfully");
  };

  // Filter gallery items by type
  const photos = (galleryItems as any[]).filter((item: any) => item.type === "photo");
  const videos = (galleryItems as any[]).filter((item: any) => item.type === "video");
  const audios = (galleryItems as any[]).filter((item: any) => item.type === "audio");

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#E8E8E8]">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2C353D]">Личный кабинет</h1>
            <p className="text-[#6E7A85] mt-1">
              Добро пожаловать, {user?.firstName} {user?.lastName}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-[#C49F64] text-[#C49F64] hover:bg-[#C49F64]/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Выход
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="memorials">Мемориалы</TabsTrigger>
            <TabsTrigger value="media">Медиа</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#2C353D] mb-6">Информация профиля</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                    Фамилия
                  </label>
                  <p className="text-[#6E7A85]">{user?.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                    Имя
                  </label>
                  <p className="text-[#6E7A85]">{user?.firstName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                    Отчество
                  </label>
                  <p className="text-[#6E7A85]">{user?.patronymic || "—"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2C353D] mb-2">
                    Email
                  </label>
                  <p className="text-[#6E7A85]">{user?.email}</p>
                </div>
              </div>

              <Button
                onClick={() => navigate("/profile")}
                className="bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Редактировать профиль
              </Button>
            </Card>
          </TabsContent>

          {/* Memorials Tab */}
          <TabsContent value="memorials" className="space-y-6">
            {/* Create Memorial Button */}
            <div>
              <Button
                onClick={handleCreateMemorial}
                className="bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать новый мемориал
              </Button>
            </div>

            {/* Memorials Grid */}
            {memorials.length === 0 ? (
              <Card className="p-12 text-center">
                <h2 className="text-2xl font-bold text-[#2C353D] mb-4">
                  У вас еще нет мемориалов
                </h2>
                <p className="text-[#6E7A85] mb-6">
                  Создайте первый мемориал, чтобы сохранить память о близком человеке
                </p>
                <Button
                  onClick={handleCreateMemorial}
                  className="bg-[#C49F64] hover:bg-[#b8934f] text-white font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать мемориал
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memorials.map((memorial) => (
                  <Card key={memorial.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Memorial Image */}
                    {memorial.mainPhoto && (
                      <div className="w-full h-48 bg-[#F0F4F8] overflow-hidden">
                        <img
                          src={memorial.mainPhoto}
                          alt={memorial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Memorial Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#2C353D] mb-2">
                        {memorial.firstName} {memorial.lastName}
                      </h3>
                      <p className="text-[#6E7A85] text-sm mb-4">
                        {memorial.birthDate} - {memorial.deathDate}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditMemorial(memorial.id)}
                          variant="outline"
                          className="flex-1 border-[#C49F64] text-[#C49F64] hover:bg-[#C49F64]/10"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Редактировать
                        </Button>
                        <Button
                          onClick={() => handleDeleteMemorial(memorial.id)}
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Удалить
                        </Button>
                      </div>

                      {/* View Link */}
                      <button
                        onClick={() => navigate(`/memorial/${memorial.id}`)}
                        className="w-full mt-4 text-[#C49F64] font-semibold hover:underline text-sm"
                      >
                        Посмотреть страницу →
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            {/* Upload Section */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[#2C353D] mb-6">Загрузить медиа</h2>
              <MediaUpload memorialId={0} mediaType="photo" onUploadComplete={() => handleMediaUploadSuccess()} />
            </Card>

            {/* Media Galleries */}
            <div className="space-y-8">
              {/* Photos */}
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Image className="w-6 h-6 text-[#C49F64]" />
                  <h3 className="text-xl font-bold text-[#2C353D]">
                    Фотографии ({photos.length})
                  </h3>
                </div>
                {photos.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.map((photo: any) => (
                      <Card key={photo.id} className="overflow-hidden">
                        <img src={photo.url} alt={photo.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <p className="font-semibold text-sm text-[#2C353D]">{photo.title}</p>
                          <p className="text-xs text-[#6E7A85]">{photo.description}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#6E7A85] text-center py-8">
                    Нет загруженных фотографий
                  </p>
                )}
              </Card>

              {/* Videos */}
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Video className="w-6 h-6 text-[#C49F64]" />
                  <h3 className="text-xl font-bold text-[#2C353D]">
                    Видео ({videos.length})
                  </h3>
                </div>
                {videos.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map((video: any) => (
                      <Card key={video.id} className="overflow-hidden">
                        <video src={video.url} className="w-full h-48 object-cover" controls />
                        <div className="p-4">
                          <p className="font-semibold text-sm text-[#2C353D]">{video.title}</p>
                          <p className="text-xs text-[#6E7A85]">{video.description}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#6E7A85] text-center py-8">
                    Нет загруженных видео
                  </p>
                )}
              </Card>

              {/* Audio */}
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Music className="w-6 h-6 text-[#C49F64]" />
                  <h3 className="text-xl font-bold text-[#2C353D]">
                    Аудиофайлы ({audios.length})
                  </h3>
                </div>
                {audios.length > 0 ? (
                  <div className="space-y-3">
                    {audios.map((audio: any) => (
                      <Card key={audio.id} className="p-4">
                        <div className="flex items-center gap-4">
                          <Music className="w-8 h-8 text-[#C49F64]" />
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-[#2C353D]">{audio.title}</p>
                            <p className="text-xs text-[#6E7A85]">{audio.description}</p>
                          </div>
                          <audio src={audio.url} controls className="w-32" />
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#6E7A85] text-center py-8">
                    Нет загруженных аудиофайлов
                  </p>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
