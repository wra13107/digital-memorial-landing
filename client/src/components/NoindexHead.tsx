import { useEffect } from "react";

/**
 * Component to add noindex and nofollow meta tags to prevent search engine indexing
 * Use this in protected/private pages like dashboard, admin panel, and user profiles
 */
export function NoindexHead() {
  useEffect(() => {
    // Create and append noindex meta tag
    const noindexMeta = document.createElement("meta");
    noindexMeta.name = "robots";
    noindexMeta.content = "noindex, nofollow";
    document.head.appendChild(noindexMeta);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(noindexMeta);
    };
  }, []);

  return null;
}
