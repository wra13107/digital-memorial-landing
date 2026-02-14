import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2, Mic } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AudioRecorder } from "./AudioRecorder";

interface MediaUploadProps {
  memorialId: number;
  mediaType: "photo" | "video" | "audio";
  onUploadComplete?: (url: string) => void;
  allowMultiple?: boolean;
}

export function MediaUpload({ memorialId, mediaType, onUploadComplete, allowMultiple = false }: MediaUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const uploadMediaMutation = trpc.memorials.uploadMedia.useMutation();
  const confirmUploadMutation = trpc.memorials.confirmMediaUpload.useMutation();

  const fileTypeMap: Record<string, string[]> = {
    photo: [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    video: [".mp4", ".webm", ".mov"],
    audio: [".mp3", ".wav", ".webm", ".ogg"],
  };

  const mimeTypeMap: Record<string, string[]> = {
    photo: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    video: ["video/mp4", "video/webm", "video/quicktime"],
    audio: ["audio/mpeg", "audio/wav", "audio/webm", "audio/ogg"],
  };

  const maxFileSize = 100 * 1024 * 1024; // 100MB

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!mimeTypeMap[mediaType].includes(file.type)) {
      toast.error(`Invalid file type. Allowed: ${fileTypeMap[mediaType].join(", ")}`);
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast.error("File size exceeds 100MB limit");
      return;
    }

    if (allowMultiple) {
      setSelectedFiles([...selectedFiles, file]);
    } else {
      setSelectedFiles([file]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setIsUploading(true);
    try {
      for (const file of selectedFiles) {
        // Step 1: Get S3 key from backend
        const uploadResponse = await uploadMediaMutation.mutateAsync({
          memorialId,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          mediaType,
        });

        // Step 2: Upload to S3
        const formData = new FormData();
        formData.append("file", file);
        formData.append("s3Key", uploadResponse.s3Key);

        const uploadUrl = `/api/upload`;
        const uploadResult = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!uploadResult.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const uploadData = await uploadResult.json();
        const fileUrl = uploadData.url;

        // Step 3: Confirm upload and add to gallery
        await confirmUploadMutation.mutateAsync({
          memorialId,
          s3Key: uploadResponse.s3Key,
          fileUrl,
          mediaType,
          title: title || undefined,
          description: description || undefined,
        });

        onUploadComplete?.(uploadResponse.s3Key);
      }

      toast.success(`${selectedFiles.length} ${mediaType}(s) uploaded successfully`);
      setSelectedFiles([]);
      setTitle("");
      setDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Simulate file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const event = new Event("change", { bubbles: true });
      Object.defineProperty(event, "target", {
        value: { files: dataTransfer.files },
        enumerable: true,
      });
      handleFileSelect(event as any);
    }
  };

  const handleRecordingComplete = (blob: Blob) => {
    const file = new File([blob], `recording-${Date.now()}.webm`, { type: "audio/webm" });
    setSelectedFiles([file]);
    setTitle("Audio recording");
    setShowRecorder(false);
    toast.success("Recording ready for upload");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload {mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}</CardTitle>
        <CardDescription>
          Max file size: 100MB. Allowed formats: {fileTypeMap[mediaType].join(", ")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio Recorder for audio media type */}
        {mediaType === "audio" && (
          <div className="space-y-2">
            {!showRecorder ? (
              <Button
                onClick={() => setShowRecorder(true)}
                variant="outline"
                className="w-full border-[#C49F64] text-[#C49F64]"
              >
                <Mic className="w-4 h-4 mr-2" />
                Record Audio Message
              </Button>
            ) : (
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            )}
          </div>
        )}

        {/* Drag and drop area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Drag and drop your file here</p>
          <p className="text-xs text-muted-foreground">or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept={fileTypeMap[mediaType].join(",")}
            onChange={handleFileSelect}
            className="hidden"
            multiple={allowMultiple}
          />
        </div>

        {/* Selected files info */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{selectedFiles.length} file(s) selected</p>
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="bg-accent/50 p-4 rounded-lg flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
                  }}
                  className="p-1 hover:bg-background rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Title and description */}
        {selectedFiles.length > 0 && (
          <>
            <div>
              <label className="text-sm font-medium">Title (optional)</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Enter ${mediaType} title`}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Enter ${mediaType} description`}
                className="w-full mt-1 p-2 border border-border rounded-md text-sm"
                rows={3}
              />
            </div>
          </>
        )}

        {/* Upload button */}
        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload {mediaType}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
