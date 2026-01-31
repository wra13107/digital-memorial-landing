import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const deleteAccountMutation = trpc.auth.deleteAccount.useMutation();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteAccountMutation.mutateAsync();
      toast.success("Ваш профиль был успешно удален");
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      const errorMessage = error?.message || "Ошибка при удалении профиля";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Удалить профиль</DialogTitle>
          <DialogDescription>
            Это действие нельзя отменить. Все ваши данные будут окончательно удалены.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-semibold mb-1">Внимание:</p>
              <p>Удаление профиля приведет к окончательному удалению:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Вашего профиля и личной информации</li>
                <li>Всех созданных мемориалов</li>
                <li>Всех фото, видео и аудиозаписей</li>
                <li>Всех данных учетной записи</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Удаление...
              </>
            ) : (
              "Удалить профиль"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
