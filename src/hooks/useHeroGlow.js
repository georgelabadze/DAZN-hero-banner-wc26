import { useEffect, useLayoutEffect, useRef, useState } from "react";

const FALLBACK_PALETTE = {
  top: [171, 212, 193],
  left: [38, 72, 84],
  right: [130, 179, 166],
  bottom: [247, 190, 76],
};
const GLOW_ALPHAS = {
  top: 0.56,
  left: 0.48,
  right: 0.44,
  bottom: 0.4,
};
const VIDEO_SAMPLE_INTERVAL = 140;
const SAMPLE_CANVAS_WIDTH = 120;

function clampChannel(value) {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function rgbaFromRgb(rgb, alpha) {
  return `rgba(${clampChannel(rgb[0])}, ${clampChannel(rgb[1])}, ${clampChannel(rgb[2])}, ${alpha})`;
}

function boostRgb(rgb, factor = 1.18, lift = 16) {
  return rgb.map((channel) => Math.min(255, channel * factor + lift));
}

function sampleRegion(ctx, width, height, xRatio, yRatio, sampleRatio) {
  const sampleWidth = Math.max(8, Math.round(width * sampleRatio));
  const sampleHeight = Math.max(8, Math.round(height * sampleRatio));
  const centerX = Math.round(width * xRatio);
  const centerY = Math.round(height * yRatio);
  const startX = Math.max(0, Math.min(width - sampleWidth, centerX - sampleWidth / 2));
  const startY = Math.max(0, Math.min(height - sampleHeight, centerY - sampleHeight / 2));
  const imageData = ctx.getImageData(startX, startY, sampleWidth, sampleHeight).data;

  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  for (let index = 0; index < imageData.length; index += 4) {
    const alpha = imageData[index + 3] / 255;
    if (alpha < 0.08) {
      continue;
    }

    red += imageData[index] * alpha;
    green += imageData[index + 1] * alpha;
    blue += imageData[index + 2] * alpha;
    count += alpha;
  }

  if (!count) {
    return [64, 96, 112];
  }

  return [red / count, green / count, blue / count];
}

function createGlowVars(palette) {
  return {
    "--hero-glow-top": rgbaFromRgb(palette.top, GLOW_ALPHAS.top),
    "--hero-glow-left": rgbaFromRgb(palette.left, GLOW_ALPHAS.left),
    "--hero-glow-right": rgbaFromRgb(palette.right, GLOW_ALPHAS.right),
    "--hero-glow-bottom": rgbaFromRgb(palette.bottom, GLOW_ALPHAS.bottom),
  };
}

function blendRgb(current, next, ratio) {
  return current.map((channel, index) => channel + (next[index] - channel) * ratio);
}

function blendPalette(current, next, ratio) {
  return {
    top: blendRgb(current.top, next.top, ratio),
    left: blendRgb(current.left, next.left, ratio),
    right: blendRgb(current.right, next.right, ratio),
    bottom: blendRgb(current.bottom, next.bottom, ratio),
  };
}

function getSourceDimensions(source) {
  if (source instanceof HTMLVideoElement) {
    return {
      width: source.videoWidth,
      height: source.videoHeight,
    };
  }

  return {
    width: source.naturalWidth,
    height: source.naturalHeight,
  };
}

function buildPaletteFromContext(context, width, height) {
  const top = sampleRegion(context, width, height, 0.5, 0.14, 0.12);
  const left = sampleRegion(context, width, height, 0.16, 0.52, 0.12);
  const right = sampleRegion(context, width, height, 0.84, 0.52, 0.12);
  const bottom = sampleRegion(context, width, height, 0.5, 0.82, 0.14);

  return {
    top: boostRgb(top, 1.16, 12),
    left: boostRgb(left, 1.12, 10),
    right: boostRgb(right, 1.12, 10),
    bottom: boostRgb(bottom, 1.14, 8),
  };
}

function samplePaletteFromSource(source, canvas, context) {
  const { width, height } = getSourceDimensions(source);

  if (!width || !height) {
    throw new Error("Missing media dimensions for glow sampling.");
  }

  const sampleWidth = Math.max(48, Math.min(SAMPLE_CANVAS_WIDTH, width));
  const sampleHeight = Math.max(48, Math.round((height / width) * sampleWidth));

  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  context.clearRect(0, 0, sampleWidth, sampleHeight);
  context.drawImage(source, 0, 0, sampleWidth, sampleHeight);

  return buildPaletteFromContext(context, sampleWidth, sampleHeight);
}

async function loadImage(imageSrc) {
  const image = new Image();
  image.decoding = "async";
  image.src = imageSrc;

  if (typeof image.decode === "function") {
    await image.decode();
  } else {
    await new Promise((resolve, reject) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", reject, { once: true });
    });
  }

  return image;
}

async function buildGlowPaletteFromSrc(imageSrc, canvas, context) {
  const image = await loadImage(imageSrc);
  return samplePaletteFromSource(image, canvas, context);
}

function geometryToStyle(demoRect, cardRect) {
  const horizontalBleed = cardRect.width * 0.075;
  const verticalBleed = cardRect.height * 0.055;
  const unclampedLeft = cardRect.left - demoRect.left - horizontalBleed;
  const unclampedTop = cardRect.top - demoRect.top - verticalBleed;
  const unclampedRight = cardRect.right - demoRect.left + horizontalBleed;
  const unclampedBottom = cardRect.bottom - demoRect.top + verticalBleed;
  const left = Math.max(0, unclampedLeft);
  const top = Math.max(0, unclampedTop);
  const right = Math.min(demoRect.width, unclampedRight);
  const bottom = Math.min(demoRect.height, unclampedBottom);

  return {
    "--hero-glow-left-offset": `${left}px`,
    "--hero-glow-top-offset": `${top}px`,
    "--hero-glow-width": `${Math.max(0, right - left)}px`,
    "--hero-glow-height": `${Math.max(0, bottom - top)}px`,
  };
}

export function useHeroGlow({ cardRef, demoRef, media, mediaRef }) {
  const [glowVars, setGlowVars] = useState(() => createGlowVars(FALLBACK_PALETTE));
  const [glowGeometry, setGlowGeometry] = useState({
    "--hero-glow-left-offset": "0px",
    "--hero-glow-top-offset": "0px",
    "--hero-glow-width": "100%",
    "--hero-glow-height": "100%",
  });
  const paletteRef = useRef(FALLBACK_PALETTE);

  useEffect(() => {
    let cancelled = false;
    let frameHandle = 0;
    let intervalHandle = 0;
    const canvas =
      typeof OffscreenCanvas !== "undefined"
        ? new OffscreenCanvas(SAMPLE_CANVAS_WIDTH, SAMPLE_CANVAS_WIDTH)
        : document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
      setGlowVars(createGlowVars(FALLBACK_PALETTE));
      return () => {
        cancelled = true;
      };
    }

    const commitPalette = (nextPalette, ratio = 1) => {
      const blendedPalette =
        ratio >= 1 ? nextPalette : blendPalette(paletteRef.current, nextPalette, ratio);
      paletteRef.current = blendedPalette;

      if (!cancelled) {
        setGlowVars(createGlowVars(blendedPalette));
      }
    };

    const applyFallback = () => {
      paletteRef.current = FALLBACK_PALETTE;

      if (!cancelled) {
        setGlowVars(createGlowVars(FALLBACK_PALETTE));
      }
    };

    const samplePoster = async () => {
      if (!media?.poster) {
        return false;
      }

      try {
        const palette = await buildGlowPaletteFromSrc(media.poster, canvas, context);
        commitPalette(palette);
        return true;
      } catch {
        return false;
      }
    };

    const sampleImageElement = async (imageElement) => {
      try {
        const palette = samplePaletteFromSource(imageElement, canvas, context);
        commitPalette(palette);
      } catch {
        if (!(await samplePoster())) {
          applyFallback();
        }
      }
    };

    const mediaElement = mediaRef.current;

    if (!media || !media.src || !mediaElement) {
      samplePoster().then((usedPoster) => {
        if (!usedPoster && !cancelled) {
          applyFallback();
        }
      });

      return () => {
        cancelled = true;
      };
    }

    if (media.kind === "image") {
      const imageElement = mediaElement;

      if (!(imageElement instanceof HTMLImageElement)) {
        buildGlowPaletteFromSrc(media.src, canvas, context)
          .then((palette) => {
            commitPalette(palette);
          })
          .catch(async () => {
            if (!(await samplePoster()) && !cancelled) {
              applyFallback();
            }
          });

        return () => {
          cancelled = true;
        };
      }

      const handleLoad = () => {
        sampleImageElement(imageElement);
      };

      if (imageElement.complete && imageElement.naturalWidth) {
        sampleImageElement(imageElement);
      } else {
        imageElement.addEventListener("load", handleLoad);
        imageElement.addEventListener("error", handleLoad);
      }

      return () => {
        cancelled = true;
        imageElement.removeEventListener("load", handleLoad);
        imageElement.removeEventListener("error", handleLoad);
      };
    }

    const videoElement = mediaElement;

    if (!(videoElement instanceof HTMLVideoElement)) {
      samplePoster().then((usedPoster) => {
        if (!usedPoster && !cancelled) {
          applyFallback();
        }
      });

      return () => {
        cancelled = true;
      };
    }

    const stopLoop = () => {
      if (typeof videoElement.cancelVideoFrameCallback === "function" && frameHandle) {
        videoElement.cancelVideoFrameCallback(frameHandle);
      }

      if (intervalHandle) {
        clearInterval(intervalHandle);
      }

      frameHandle = 0;
      intervalHandle = 0;
    };

    let lastSampleTime = 0;

    const sampleVideoFrame = (timestamp = performance.now()) => {
      if (
        cancelled ||
        document.hidden ||
        videoElement.paused ||
        videoElement.ended ||
        videoElement.readyState < 2 ||
        !videoElement.videoWidth
      ) {
        return;
      }

      if (timestamp - lastSampleTime < VIDEO_SAMPLE_INTERVAL) {
        return;
      }

      lastSampleTime = timestamp;

      try {
        const palette = samplePaletteFromSource(videoElement, canvas, context);
        commitPalette(palette, 0.32);
      } catch {
        samplePoster();
      }
    };

    const scheduleLoop = () => {
      stopLoop();

      if (typeof videoElement.requestVideoFrameCallback === "function") {
        const handleFrame = (timestamp) => {
          sampleVideoFrame(timestamp);

          if (!cancelled && !document.hidden && !videoElement.paused && !videoElement.ended) {
            frameHandle = videoElement.requestVideoFrameCallback(handleFrame);
          }
        };

        frameHandle = videoElement.requestVideoFrameCallback(handleFrame);
        return;
      }

      intervalHandle = window.setInterval(() => {
        sampleVideoFrame(performance.now());
      }, VIDEO_SAMPLE_INTERVAL);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
        return;
      }

      if (!videoElement.paused && !videoElement.ended) {
        scheduleLoop();
      }
    };

    const handlePlay = () => {
      sampleVideoFrame(performance.now());
      scheduleLoop();
    };

    const handlePause = () => {
      stopLoop();
    };

    const handleLoadedData = () => {
      sampleVideoFrame(performance.now());
    };

    const handleError = async () => {
      stopLoop();
      if (!(await samplePoster()) && !cancelled) {
        applyFallback();
      }
    };

    samplePoster();

    videoElement.addEventListener("loadeddata", handleLoadedData);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("playing", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("ended", handlePause);
    videoElement.addEventListener("error", handleError);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (videoElement.readyState >= 2) {
      sampleVideoFrame(performance.now());
    }

    if (!videoElement.paused && !document.hidden) {
      scheduleLoop();
    }

    return () => {
      cancelled = true;
      stopLoop();
      videoElement.removeEventListener("loadeddata", handleLoadedData);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("playing", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("ended", handlePause);
      videoElement.removeEventListener("error", handleError);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [media, mediaRef]);

  useLayoutEffect(() => {
    const demo = demoRef.current;
    const card = cardRef.current;

    if (!demo || !card) {
      return undefined;
    }

    let frameId = 0;

    const updateGeometry = () => {
      const nextGeometry = geometryToStyle(
        demo.getBoundingClientRect(),
        card.getBoundingClientRect(),
      );

      setGlowGeometry((current) => {
        const isSame = Object.keys(nextGeometry).every(
          (key) => current[key] === nextGeometry[key],
        );
        return isSame ? current : nextGeometry;
      });
    };

    const scheduleGeometry = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateGeometry);
    };

    const resizeObserver = new ResizeObserver(scheduleGeometry);
    resizeObserver.observe(demo);
    resizeObserver.observe(card);
    window.addEventListener("resize", scheduleGeometry);
    scheduleGeometry();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", scheduleGeometry);
      resizeObserver.disconnect();
    };
  }, [cardRef, demoRef]);

  return { ...glowVars, ...glowGeometry };
}
