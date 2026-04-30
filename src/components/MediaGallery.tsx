import { useState } from "react";
import Image from "next/image";

type MediaGalleryProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
};

export function MediaGallery({ src, alt, className = "", fill = false, width, height, priority = false }: MediaGalleryProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton / Blur placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#00F2FF]/5 animate-pulse flex items-center justify-center">
           <div className="w-8 h-8 rounded-full border-2 border-[#00F2FF]/20 border-t-[#00F2FF] animate-spin" />
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        priority={priority}
        className={`transition-opacity duration-500 ease-in ${isLoaded ? "opacity-100" : "opacity-0"} ${fill ? "object-cover" : ""}`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
