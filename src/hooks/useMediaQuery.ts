"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to check if a media query matches
 * Safely handles SSR by returning false initially
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (!isClient) return;

    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    
    // Use addEventListener for better browser support
    media.addEventListener("change", listener);
    
    return () => media.removeEventListener("change", listener);
  }, [matches, isClient, query]);

  // Return false on server, actual value on client
  return isClient ? matches : false;
}
