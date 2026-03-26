"use client";

import { usePerformanceProfile } from "@/hooks/usePerformanceProfile";
import Image from "next/image";
import { CSSProperties, useEffect, useState } from "react";

interface AdaptiveHeroMediaProps {
  alt: string;
  className?: string;
  imagePriority?: boolean;
  imageSizes?: string;
  posterSrc: string;
  style?: CSSProperties;
  videoSrc?: string;
}

export default function AdaptiveHeroMedia({
  alt,
  className,
  imagePriority = false,
  imageSizes = "100vw",
  posterSrc,
  style,
  videoSrc,
}: AdaptiveHeroMediaProps) {
  const { shouldAutoplayMedia } = usePerformanceProfile();
  const [allowVideo, setAllowVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    if (!videoSrc || !shouldAutoplayMedia) {
      setAllowVideo(false);
      return;
    }

    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const enableVideo = () => setAllowVideo(true);
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(() => enableVideo(), { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(enableVideo, 600);
    }

    return () => {
      if (idleId !== null && typeof idleWindow.cancelIdleCallback === "function") {
        idleWindow.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [shouldAutoplayMedia, videoSrc]);

  if (!videoSrc || !allowVideo || videoFailed) {
    return (
      <Image
        src={posterSrc}
        alt={alt}
        fill
        className={className}
        priority={imagePriority}
        sizes={imageSizes}
        style={style}
      />
    );
  }

  return (
    <video
      autoPlay
      className={className}
      loop
      muted
      playsInline
      preload="metadata"
      style={style}
      onError={() => setVideoFailed(true)}
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}
