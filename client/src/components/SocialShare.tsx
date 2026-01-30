import { Share2, Facebook, Twitter, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export function SocialShare({ url, title, description }: SocialShareProps) {
  const [showMenu, setShowMenu] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
    setShowMenu(false);
    toast.success(`Открыто окно поделиться в ${platform}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Ссылка скопирована в буфер обмена");
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        variant="outline"
        size="sm"
        className="border-[#C49F64] text-[#C49F64] hover:bg-[#C49F64]/10"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Поделиться
      </Button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E8E8E8] rounded-lg shadow-lg z-50">
          <div className="p-2">
            {/* Facebook */}
            <button
              onClick={() => handleShare("facebook")}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F0F4F8] rounded-md transition-colors text-left"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
              <span className="text-[#2C353D]">Facebook</span>
            </button>

            {/* Twitter */}
            <button
              onClick={() => handleShare("twitter")}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F0F4F8] rounded-md transition-colors text-left"
            >
              <Twitter className="w-5 h-5 text-blue-400" />
              <span className="text-[#2C353D]">Twitter</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleShare("whatsapp")}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F0F4F8] rounded-md transition-colors text-left"
            >
              <MessageCircle className="w-5 h-5 text-green-500" />
              <span className="text-[#2C353D]">WhatsApp</span>
            </button>

            {/* Telegram */}
            <button
              onClick={() => handleShare("telegram")}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F0F4F8] rounded-md transition-colors text-left"
            >
              <Send className="w-5 h-5 text-blue-500" />
              <span className="text-[#2C353D]">Telegram</span>
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-[#E8E8E8]" />

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#F0F4F8] rounded-md transition-colors text-left"
            >
              <Share2 className="w-5 h-5 text-[#C49F64]" />
              <span className="text-[#2C353D]">Копировать ссылку</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
