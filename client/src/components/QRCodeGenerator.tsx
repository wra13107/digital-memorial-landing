import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";

interface QRCodeGeneratorProps {
  url: string;
  title?: string;
  size?: number;
}

export function QRCodeGenerator({ url, title = "Memorial QR Code", size = 256 }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) {
      toast.error("Failed to generate QR code");
      return;
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `memorial-qr-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded successfully");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("Memorial URL copied to clipboard");
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-[#F0F4F8] rounded-lg border border-[#E8E8E8]">
      <h3 className="font-semibold text-[#2C353D]">{title}</h3>

      {/* QR Code Display */}
      <div
        ref={qrRef}
        className="p-4 bg-white rounded-lg border border-[#E8E8E8]"
      >
        <QRCodeSVG
          value={url}
          size={size}
          level="H"
          includeMargin={true}
          fgColor="#2C353D"
          bgColor="#FFFFFF"
        />
      </div>

      {/* URL Display */}
      <div className="w-full">
        <p className="text-xs text-[#6E7A85] mb-2">Memorial URL:</p>
        <div className="flex items-center gap-2 p-2 bg-white rounded border border-[#E8E8E8] text-xs break-all">
          <span className="flex-1 text-[#2C353D]">{url}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 w-full">
        <Button
          onClick={downloadQRCode}
          className="flex-1 bg-[#C49F64] hover:bg-[#b8934f] text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download QR Code
        </Button>
        <Button
          onClick={copyToClipboard}
          variant="outline"
          className="flex-1 border-[#C49F64] text-[#C49F64]"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Link
        </Button>
      </div>

      {/* Info Text */}
      <p className="text-xs text-[#6E7A85] text-center">
        Share this QR code on the memorial nameplate or with family and friends to provide easy access to the digital memorial.
      </p>
    </div>
  );
}
