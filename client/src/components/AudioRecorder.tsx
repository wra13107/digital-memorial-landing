import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Pause, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        
        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      toast.success("Запись началась");
    } catch (error) {
      toast.error("Не удалось получить доступ к микрофону");
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      toast.success("Запись остановлена");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        toast.success("Запись продолжена");
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        toast.success("Запись приостановлена");
      }
    }
  };

  const resetRecording = () => {
    setRecordedBlob(null);
    setPreviewUrl("");
    setDuration(0);
    setIsRecording(false);
    setIsPaused(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    toast.success("Запись удалена");
  };

  const handleUpload = () => {
    if (recordedBlob) {
      onRecordingComplete(recordedBlob, duration);
      resetRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 p-4 bg-[#F0F4F8] rounded-lg border border-[#E8E8E8]">
      <h3 className="font-semibold text-[#2C353D]">Запись аудиосообщения</h3>

      {/* Recording Controls */}
      {!recordedBlob ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isRecording && (
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
              <span className="text-sm font-medium text-[#2C353D]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className="flex-1 bg-[#C49F64] hover:bg-[#b8934f] text-white"
              >
                <Mic className="w-4 h-4 mr-2" />
                Начать запись
              </Button>
            ) : (
              <>
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                  className="flex-1 border-[#C49F64] text-[#C49F64]"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Продолжить
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Пауза
                    </>
                  )}
                </Button>
                <Button
                  onClick={stopRecording}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Остановить
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Preview and Upload */
        <div className="space-y-3">
          <div className="p-3 bg-white rounded border border-[#E8E8E8]">
            <p className="text-sm text-[#6E7A85] mb-2">Предпросмотр:</p>
            <audio
              src={previewUrl}
              controls
              className="w-full h-8"
            />
            <p className="text-xs text-[#6E7A85] mt-2">
              Длительность: {formatTime(duration)}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              className="flex-1 bg-[#C49F64] hover:bg-[#b8934f] text-white"
            >
              Загрузить
            </Button>
            <Button
              onClick={resetRecording}
              variant="outline"
              className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
