/**
 * Utility function to download QR code as PNG image
 * @param memorialId - ID of the memorial
 * @param memorialName - Full name of the deceased for the filename
 */
export async function downloadQRCode(memorialId: number, memorialName: string) {
  try {
    // Generate QR code URL for the memorial
    const memorialUrl = `${window.location.origin}/memorial/${memorialId}`;

    // Use QR code API to generate QR code image
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(memorialUrl)}`;

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `memorial-qr-${memorialName.replace(/\s+/g, '-')}-${memorialId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Failed to download QR code:', error);
    throw error;
  }
}

/**
 * Generate QR code as canvas element for printing
 * @param memorialId - ID of the memorial
 * @param size - Size of the QR code in pixels (default: 300)
 */
export function generateQRCodeCanvas(memorialId: number, size: number = 300): string {
  const memorialUrl = `${window.location.origin}/memorial/${memorialId}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(memorialUrl)}`;
}
