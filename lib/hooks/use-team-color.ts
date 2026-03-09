"use client";

import { useState, useEffect } from "react";
import { getTeamColor, TEAM_COLORS } from "@/lib/utils";
import { extractColorFromImage, getCachedColor } from "@/lib/color-extractor";

/**
 * Hook that resolves a team's button color with this priority:
 *
 * 1. API kit colors from lineup data (if available)
 * 2. Color extracted from team logo image (canvas-based)
 * 3. Static TEAM_COLORS map (hardcoded ~50 popular teams)
 * 4. Default brand blue (#1552f0)
 *
 * The hook first returns the best synchronous value (static map / API kit),
 * then upgrades to the extracted logo color once it resolves.
 */
export function useTeamColor(
  teamId: number,
  logoUrl: string | null | undefined,
  kitPrimaryColor?: string | null,
): string {
  // Synchronous fallback: API kit > static map > default
  const staticColor = getTeamColor(teamId, kitPrimaryColor);

  // If we already have a good static color (from kit or known team), use it
  const hasKitColor = kitPrimaryColor && /^#?[0-9a-fA-F]{6}$/.test(kitPrimaryColor);
  const hasStaticMapping = TEAM_COLORS[teamId] !== undefined;

  // Check if we have a cached extraction already (sync)
  const cachedExtraction = logoUrl ? getCachedColor(logoUrl) : null;

  const [extractedColor, setExtractedColor] = useState<string | null>(cachedExtraction);

  useEffect(() => {
    // Skip extraction if:
    // - No logo URL
    // - We already have a kit color from the API (most reliable source)
    // - We already have a cached extraction
    if (!logoUrl || hasKitColor || cachedExtraction) return;

    let cancelled = false;

    extractColorFromImage(logoUrl).then((color) => {
      if (!cancelled && color) {
        setExtractedColor(color);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [logoUrl, hasKitColor, cachedExtraction]);

  // Priority: kit color > extracted from logo > static map > default
  if (hasKitColor) return staticColor;
  if (extractedColor) return extractedColor;
  if (hasStaticMapping) return staticColor;
  if (cachedExtraction) return cachedExtraction;

  return staticColor;
}
