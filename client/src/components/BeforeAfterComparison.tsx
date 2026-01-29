import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BeforeAfterComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

/**
 * BeforeAfterComparison Component
 * 
 * Interactive slider for comparing two images side-by-side.
 * Features:
 * - Drag to compare
 * - Touch support for mobile
 * - Keyboard navigation
 * - Smooth animations
 * - Responsive design
 */
export default function BeforeAfterComparison({
  beforeImage,
  afterImage,
  beforeLabel = "До",
  afterLabel = "После",
}: BeforeAfterComparisonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-lg shadow-lg cursor-ew-resize bg-[#2C353D] group"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuenow={sliderPosition}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Before Image (Background) */}
      <div className="relative w-full pt-[66.67%]">
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 w-full h-full object-cover select-none"
          draggable={false}
        />
      </div>

      {/* After Image (Overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover select-none"
          style={{ width: `${(100 / sliderPosition) * 100}%` }}
          draggable={false}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white transition-opacity"
        style={{
          left: `${sliderPosition}%`,
          opacity: isDragging ? 1 : 0.7,
        }}
      >
        {/* Handle Button */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:w-14 hover:h-14 group-focus:w-14 group-focus:h-14">
          <div className="flex gap-1">
            <ChevronLeft className="w-5 h-5 text-[#C49F64]" />
            <ChevronRight className="w-5 h-5 text-[#C49F64]" />
          </div>
        </div>
      </div>

      {/* Before Label */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-semibold text-sm pointer-events-none">
        {beforeLabel}
      </div>

      {/* After Label */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-semibold text-sm pointer-events-none">
        {afterLabel}
      </div>

      {/* Mobile Hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        Перетащите для сравнения
      </div>
    </div>
  );
}
