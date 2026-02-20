"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";


export default function ScrollVideo({ 
  folderPath, 
  frameCount, 
  triggerRef, 
  start = "top top", 
  end = "bottom bottom",
  fit = "cover", 
  anchor = "center", // center, top, bottom
  padding = 0, // Padding in pixels
  manualProgress = null 
}) {

  const canvasRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: triggerRef,
    offset: [start, end],
  });
  const currentFrameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentFrameRef = useRef(0);

  // 1. Preload Images
  useEffect(() => {
    let loadedCount = 0;
    const imgs = [];

    const preload = async () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const frameNum = i.toString().padStart(3, "0");
        img.src = `${folderPath}/frame_${frameNum}.webp`;
        
        img.onload = () => {
          loadedCount++;
          if (loadedCount === frameCount) setIsLoaded(true);
        };
        imgs.push(img);
      }
      setImages(imgs);
    };

    preload();
  }, [folderPath, frameCount]);

  const renderFrame = (idx, canvas, ctx, imgs) => {
    if (!imgs || imgs.length === 0 || !canvas || !ctx) return;
    const img = imgs[idx];
    if (!img) return;

    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = canvas.width / dpr;
    const logicalHeight = canvas.height / dpr;

    // Available drawing area
    const availableWidth = logicalWidth - padding * 2;
    const availableHeight = logicalHeight - padding * 2;

    const hRatio = availableWidth / img.width;
    const vRatio = availableHeight / img.height;
    const ratio = fit === "cover" ? Math.max(hRatio, vRatio) : Math.min(hRatio, vRatio);
    
    const centerShift_x = (logicalWidth - img.width * ratio) / 2;
    let centerShift_y = (logicalHeight - img.height * ratio) / 2;

    if (anchor === "top") centerShift_y = padding;
    if (anchor === "bottom") centerShift_y = logicalHeight - img.height * ratio - padding;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.drawImage(
      img, 
      0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
    );
    ctx.restore();
  };

  // Handle Canvas Resizing (HiDPI)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      
      const ctx = canvas.getContext("2d");
      renderFrame(currentFrameRef.current, canvas, ctx, images);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas.parentElement);
    
    handleResize();
    return () => resizeObserver.disconnect();
  }, [images, fit, anchor, padding]);

  // Handle Manual Progress
  useEffect(() => {
    if (manualProgress !== null && isLoaded && images.length > 0 && canvasRef.current) {
      const frameIndex = Math.min(
        frameCount - 1,
        Math.max(0, Math.round(manualProgress * (frameCount - 1)))
      );
      currentFrameRef.current = frameIndex;
      const canvas = canvasRef.current;
      renderFrame(frameIndex, canvas, canvas.getContext("2d"), images);
    }
  }, [manualProgress, isLoaded, images, frameCount, padding]);

  useEffect(() => {
    if (manualProgress !== null) return; // Manual progress takes precedence
    if (!isLoaded || images.length === 0 || !canvasRef.current) return;

    const unsubscribe = currentFrameIndex.onChange((latest) => {
      const frameIndex = Math.round(latest);
      currentFrameRef.current = frameIndex;
      const canvas = canvasRef.current;
      if (canvas) renderFrame(frameIndex, canvas, canvas.getContext("2d"), images);
    });

    return () => unsubscribe();
  }, [isLoaded, images, currentFrameIndex, manualProgress]);


  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center text-primary/50 text-sm font-body animate-pulse">
          Loading Visuals...
        </div>
      )}
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full object-cover"
      />
    </div>
  );
}
