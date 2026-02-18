"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollVideo({ 
  folderPath, 
  frameCount, 
  triggerRef, // The element that triggers the scroll animation
  start = "top top", 
  end = "bottom bottom" 
}) {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Preload Images
  useEffect(() => {
    let loadedCount = 0;
    const imgs = [];

    // Preload loop
    const preload = async () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        // Pad with zeros (e.g. frame_001.webp)
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

  // 2. Setup Canvas & GSAP
  useGSAP(() => {
    if (!isLoaded || images.length === 0 || !canvasRef.current || !triggerRef?.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Resize handler
    const handleResize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      // Re-render current frame on resize
      // Since we don't have easy access to current frame index here without ref, 
      // typically we just let the next scroll update handle it, or store frame in a ref.
      // For simplicity, we can just clear.
    };
    
    // Initial size
    handleResize();
    window.addEventListener("resize", handleResize);

    // Frame object to tween
    const frameObj = { frame: 0 };

    // ScrollTrigger Animation
    gsap.to(frameObj, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: start,
        end: end,
        scrub: 0.5,
      },
      onUpdate: () => {
        const frameIndex = Math.round(frameObj.frame);
        const img = images[frameIndex];
        
        if (img && ctx) {
          // Calculate "cover" dimensions
          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.max(hRatio, vRatio);
          
          const centerShift_x = (canvas.width - img.width * ratio) / 2;
          const centerShift_y = (canvas.height - img.height * ratio) / 2;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(
            img, 
            0, 0, img.width, img.height,
            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
          );
        }
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
    };

  }, [isLoaded, images, triggerRef, start, end]);

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
