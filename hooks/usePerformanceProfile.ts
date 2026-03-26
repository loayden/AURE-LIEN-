"use client";

import { useEffect, useState } from "react";

type NetworkInformationLike = {
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

type NavigatorWithPerformanceHints = Navigator & {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
};

export interface PerformanceProfile {
  finePointer: boolean;
  prefersReducedMotion: boolean;
  prefersReducedData: boolean;
  lowEndDevice: boolean;
  slowNetwork: boolean;
  shouldAutoplayMedia: boolean;
  shouldReduceDecorativeMotion: boolean;
}

const DEFAULT_PROFILE: PerformanceProfile = {
  finePointer: false,
  prefersReducedMotion: false,
  prefersReducedData: false,
  lowEndDevice: false,
  slowNetwork: false,
  shouldAutoplayMedia: true,
  shouldReduceDecorativeMotion: false,
};

function subscribeToMediaQuery(query: MediaQueryList, listener: () => void) {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }

  query.addListener(listener);
  return () => query.removeListener(listener);
}

function buildProfile(): PerformanceProfile {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }

  const navigatorWithHints = navigator as NavigatorWithPerformanceHints;
  const connection = navigatorWithHints.connection;
  const effectiveType = connection?.effectiveType ?? "";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReducedData = Boolean(connection?.saveData);
  const slowNetwork = ["slow-2g", "2g", "3g"].includes(effectiveType);
  const lowMemory = typeof navigatorWithHints.deviceMemory === "number" && navigatorWithHints.deviceMemory <= 4;
  const lowCpu = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
  const lowEndDevice = prefersReducedData || slowNetwork || lowMemory || lowCpu;
  const shouldReduceDecorativeMotion = prefersReducedMotion || lowEndDevice;

  return {
    finePointer,
    prefersReducedMotion,
    prefersReducedData,
    lowEndDevice,
    slowNetwork,
    // Background autoplay video is the biggest mobile crash vector in this app.
    // Keep it for desktop-class devices only.
    shouldAutoplayMedia: finePointer && !shouldReduceDecorativeMotion,
    shouldReduceDecorativeMotion,
  };
}

export function usePerformanceProfile() {
  const [profile, setProfile] = useState<PerformanceProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const connection = (navigator as NavigatorWithPerformanceHints).connection;
    const syncProfile = () => {
      setProfile(buildProfile());
    };

    syncProfile();

    const unsubscribeMotion = subscribeToMediaQuery(motionQuery, syncProfile);
    const unsubscribePointer = subscribeToMediaQuery(pointerQuery, syncProfile);
    connection?.addEventListener?.("change", syncProfile);

    return () => {
      unsubscribeMotion();
      unsubscribePointer();
      connection?.removeEventListener?.("change", syncProfile);
    };
  }, []);

  return profile;
}
