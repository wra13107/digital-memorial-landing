import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, LogOut, Image, Video, Music, Trash, Search, Users as UsersIcon } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { MediaUpload } from "@/components/MediaUpload";
import { MediaGallery } from "@/components/MediaGallery";
import { NoindexHead } from "@/components/NoindexHead";
import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    phone: "",
    countryCode: "US",
    role: "customer" as "admin" | "user" | "customer",
  });

  // Fetch gallery items - requires memorialId, so we'll skip for now
  const { data: galleryItems = [] } = trpc.memorials.getGalleryItems.useQuery(
    { memorialId: 0 },
    { enabled: false }
  );

  // Fetch users list (for admins only)
  const { data: users = [], isLoading: usersLoading, refetch: refetchUsers } = trpc.admin.listUsers.useQuery(
    undefined,
    { enabled: user?.role === "admin" }
  );

  // User management mutations
  const createUserMutation = trpc.admin.createUser.useMutation({
    onSuccess: () => {
      refetchUsers();
      setShowAddUserForm(false);
      setNewUser({
        email: "",
        password: "",
        phone: "",
        countryCode: "US",
        role: "customer",
      });
    },
    onError: (error) => {
      alert(`Ошибка: ${error.message}`);
    },
  });

  const updateUserMutation = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      refetchUsers();
    },
    onError: (error) => {
      alert(`Ошибка: ${error.message}`);
    },
  });

  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      refetchUsers();
    },
    onError: (error) => {
      alert(`Ошибка: ${error.message}`);
    },
  });

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

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password) {
      alert("Пожалуйста, заполните email и пароль");
      return;
    }

    createUserMutation.mutate({
      email: newUser.email,
      password: newUser.password,
      phone: newUser.phone,
      countryCode: newUser.countryCode,
      role: newUser.role,
    });
  };

  const handleUpdateUser = (userId: number, updates: any) => {
    updateUserMutation.mutate({
      id: userId,
      ...updates,
    });
  };

  const handleDeleteUser = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      deleteUserMutation.mutate({ id });
    }
  };

  // Filter gallery items by type
  const photos = (galleryItems as any[]).filter((item: any) => item.type === "photo");
  const videos = (galleryItems as any[]).filter((item: any) => item.type === "video");
  const audios = (galleryItems as any[]).filter((item: any) => item.type === "audio");

  // Filter users by search term
  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex gap-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-[#C49F64] text-[#C49F64] hover:bg-[#C49F64]/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Выход
            </Button>
            <Button
              onClick={() => setDeleteDialogOpen(true)}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash className="w-4 h-4 mr-2" />
              Удалить профиль
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full ${user?.role === "admin" ? "grid-cols-3" : "grid-cols-2"} mb-6`}>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="memorials">Мемориалы</TabsTrigger>
            {user?.role === "admin" && (
              <TabsTrigger value="users">Пользователи</TabsTrigger>
            )}
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

          {/* Users Tab - Only for Admins */}
          {user?.role === "admin" && (
            <TabsContent value="users" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#2C353D]">Управление пользователями</h2>
                <Button
                  onClick={() => setShowAddUserForm(!showAddUserForm)}
                  className="bg-[#C49F64] hover:bg-[#b8934f] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить пользователя
                </Button>
              </div>

              {/* Add User Form */}
              {showAddUserForm && (
                <Card className="p-6">
                  <h3 className="text-lg font-bold text-[#2C353D] mb-4">Добавить нового пользователя</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <Input
                      type="password"
                      placeholder="Пароль (минимум 8 символов)"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <Input
                      type="tel"
                      placeholder="Телефон"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    />
                    <Input
                      type="text"
                      placeholder="Код страны (US, RU, etc.)"
                      value={newUser.countryCode}
                      onChange={(e) => setNewUser({ ...newUser, countryCode: e.target.value.toUpperCase() })}
                      maxLength={2}
                    />
                    <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Администратор</SelectItem>
                        <SelectItem value="user">Пользователь</SelectItem>
                        <SelectItem value="customer">Клиент</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddUser}
                      disabled={createUserMutation.isPending}
                      className="bg-[#C49F64] hover:bg-[#b8934f] text-white"
                    >
                      {createUserMutation.isPending ? "Добавление..." : "Добавить"}
                    </Button>
                    <Button
                      onClick={() => setShowAddUserForm(false)}
                      variant="outline"
                      className="border-[#E8E8E8]"
                    >
                      Отмена
                    </Button>
                  </div>
                </Card>
              )}

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-[#6E7A85]" />
                  <Input
                    type="text"
                    placeholder="Поиск по имени или email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Users Table */}
              {usersLoading ? (
                <Card className="p-8 text-center">
                  <p className="text-[#6E7A85]">Загрузка...</p>
                </Card>
              ) : filteredUsers.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-[#6E7A85]">Пользователей не найдено</p>
                </Card>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E8E8E8]">
                        <th className="text-left py-4 px-4 font-semibold text-[#2C353D]">Имя</th>
                        <th className="text-left py-4 px-4 font-semibold text-[#2C353D]">Email</th>
                        <th className="text-left py-4 px-4 font-semibold text-[#2C353D]">Роль</th>
                        <th className="text-left py-4 px-4 font-semibold text-[#2C353D]">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b border-[#E8E8E8] hover:bg-[#F0F4F8]">
                          <td className="py-4 px-4 text-[#2C353D]">
                            {u.firstName} {u.lastName}
                          </td>
                          <td className="py-4 px-4 text-[#6E7A85]">{u.email}</td>
                          <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            u.role === "admin"
                              ? "bg-[#C49F64]/20 text-[#C49F64]"
                              : u.role === "user"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-[#F0F4F8] text-[#6E7A85]"
                          }`}
                        >
                          {u.role === "admin" ? "Администратор" : u.role === "user" ? "Пользователь" : "Клиент"}
                        </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#C49F64] text-[#C49F64] hover:bg-[#C49F64]/10"
                              onClick={() => {
                                const roleOrder = { admin: "user", user: "customer", customer: "admin" };
                                const newRole = roleOrder[u.role as keyof typeof roleOrder] || "customer";
                                handleUpdateUser(u.id, { role: newRole });
                              }}
                                disabled={updateUserMutation.isPending}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteUser(u.id)}
                                disabled={deleteUserMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </main>

      {/* Delete Account Dialog */}
      <DeleteAccountDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
    </div>
  );
}
