"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getStrapiMedia } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ProductGallery({ images, name }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
      emblaApi.on("select", onSelect);
      onSelect();
    }
  }, [emblaApi]);

  const currentImage = images?.[activeIndex];
  const imageUrl =
    getStrapiMedia(currentImage?.formats?.medium) ||
    getStrapiMedia(currentImage?.url) ||
    getStrapiMedia(images?.[0]?.formats?.medium) ||
    getStrapiMedia(images?.[0]?.url);

  const getOriginalImageUrl = () => {
    const current = images?.[activeIndex] || images?.[0];
    return getStrapiMedia(current?.url);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-secondary rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground font-bold italic">No Image</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((img, idx) => {
            const imgUrl =
              getStrapiMedia(img.formats?.medium) ||
              getStrapiMedia(img.url);
            return (
              <div key={idx} className="flex-[0_0_100%] min-w-0">
                <div className="aspect-square w-full flex items-center justify-center bg-card">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={`${name} ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-muted-foreground">No Image</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-card/80 border border-border rounded-full shadow-lg text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-card/80 border border-border rounded-full shadow-lg text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="absolute top-4 right-4 z-20">
        <a
          href={getOriginalImageUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-card border border-border rounded-full shadow-lg text-primary hover:bg-primary hover:text-primary-foreground transition-all inline-flex"
        >
          <Search className="w-5 h-5" />
        </a>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar justify-start">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi?.scrollTo(idx)}
              className={cn(
                "w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 flex items-center justify-center",
                activeIndex === idx
                  ? "border-primary shadow-md"
                  : "border-transparent opacity-60 grayscale hover:opacity-100 hover:grayscale-0",
              )}
            >
              <img
                src={getStrapiMedia(img.formats?.small) || getStrapiMedia(img.url)}
                alt=""
                className="max-w-full max-h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
