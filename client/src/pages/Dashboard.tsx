import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Edit2, Trash2, LogOut } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [memorials, setMemorials] = useState<any[]>([]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleCreateMemorial = () => {
    navigate("/create-memorial");
  };

  const handleEditMemorial = (id: string) => {
    navigate(`/edit-memorial/${id}`);
  };

  const handleDeleteMemorial = (id: string) => {
    // TODO: Implement delete API call
    setMemorials(memorials.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#E8E8E8]">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2C353D]">Личный кабинет</h1>
            <p className="text-[#6E7A85] mt-1">
              Добро пожаловать, {user?.name}
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
        {/* Create Memorial Button */}
        <div className="mb-8">
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
      </main>
    </div>
  );
}
