import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit2, Trash2, LogOut, Plus, Search } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-[#2C353D] mb-4">Доступ запрещен</h1>
          <p className="text-[#6E7A85] mb-6">
            У вас нет прав доступа к административной панели
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-[#C49F64] hover:bg-[#b8934f] text-white"
          >
            Вернуться на главную
          </Button>
        </Card>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleAddUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
      alert("Пожалуйста, заполните все поля");
      return;
    }
    // TODO: Implement add user API call
    setShowAddUserForm(false);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
  };

  const handleDeleteUser = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      // TODO: Implement delete user API call
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#E8E8E8]">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2C353D]">Административная панель</h1>
            <p className="text-[#6E7A85] mt-1">Управление пользователями и мемориалами</p>
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
        {/* Users Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#2C353D]">Пользователи</h2>
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
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-bold text-[#2C353D] mb-4">Добавить нового пользователя</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input
                  type="text"
                  placeholder="Имя"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Фамилия"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <Input
                  type="password"
                  placeholder="Пароль"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddUser}
                  className="bg-[#C49F64] hover:bg-[#b8934f] text-white"
                >
                  Добавить
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
          {users.length === 0 ? (
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
                              : "bg-[#F0F4F8] text-[#6E7A85]"
                          }`}
                        >
                          {u.role === "admin" ? "Администратор" : "Пользователь"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#C49F64] text-[#C49F64] hover:bg-[#C49F64]/10"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteUser(u.id)}
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
        </div>
      </main>
    </div>
  );
}
