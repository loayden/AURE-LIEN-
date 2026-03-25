"use client";

import { useEffect } from "react";

let activeOverlayCount = 0;

function setShellIsolation(active: boolean) {
  const shell = document.getElementById("app-shell");
  if (!shell) return;

  if (active) {
    shell.setAttribute("aria-hidden", "true");
    shell.setAttribute("inert", "");
    return;
  }

  shell.removeAttribute("aria-hidden");
  shell.removeAttribute("inert");
}

export function useOverlayIsolation(active: boolean) {
  useEffect(() => {
    if (!active) return;

    activeOverlayCount += 1;
    setShellIsolation(true);

    return () => {
      activeOverlayCount = Math.max(0, activeOverlayCount - 1);
      if (activeOverlayCount === 0) {
        setShellIsolation(false);
      }
    };
  }, [active]);
}
