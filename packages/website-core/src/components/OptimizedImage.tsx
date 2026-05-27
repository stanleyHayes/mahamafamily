import { useState, useCallback } from "react";
import { Box, Skeleton, type SxProps, type Theme } from "@mui/material";

export interface OptimizedImageProps {
  src: string;
  alt: string;
  aspectRatio?: string | number;
  sizes?: string;
  srcSet?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  sx?: SxProps<Theme>;
  imgSx?: SxProps<Theme>;
}

const BREAKPOINTS = [400, 800, 1200, 1600];

function isCloudinaryUrl(url: string): boolean {
  return url.includes("res.cloudinary.com");
}

function appendCloudinaryTransform(url: string, width: number): string {
  const uploadMarker = "/upload/";
  const idx = url.indexOf(uploadMarker);
  if (idx === -1) return url;
  const prefix = url.slice(0, idx + uploadMarker.length);
  const suffix = url.slice(idx + uploadMarker.length);
  if (suffix.includes(`w_${width}`)) return url;
  return `${prefix}f_auto,q_auto,w_${width}/${suffix}`;
}

export function buildCloudinarySrcSet(url: string): string {
  if (!isCloudinaryUrl(url)) return "";
  return BREAKPOINTS.map((w) => `${appendCloudinaryTransform(url, w)} ${w}w`).join(", ");
}

export function buildCloudinarySrc(url: string, defaultWidth = 800): string {
  if (!isCloudinaryUrl(url)) return url;
  return appendCloudinaryTransform(url, defaultWidth);
}

export function OptimizedImage({
  src,
  alt,
  aspectRatio,
  sizes = "100vw",
  srcSet,
  objectFit = "cover",
  sx,
  imgSx,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const resolvedSrc = buildCloudinarySrc(src);
  const resolvedSrcSet = srcSet ?? buildCloudinarySrcSet(src);

  return (
    <Box
      sx={[
        { position: "relative", ...(aspectRatio ? { aspectRatio } : {}) },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {!loaded && (
        <Skeleton
          variant="rectangular"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        />
      )}
      <Box
        component="img"
        src={resolvedSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        srcSet={resolvedSrcSet || undefined}
        sizes={sizes}
        onLoad={handleLoad}
        sx={[
          {
            width: "100%",
            height: "100%",
            objectFit,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.4s ease",
            display: "block",
          },
          ...(Array.isArray(imgSx) ? imgSx : [imgSx]),
        ]}
      />
    </Box>
  );
}
