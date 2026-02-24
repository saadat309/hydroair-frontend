'use client';

import { cn } from '@/lib/utils';

export default function TagFilter({ tags, selectedTag, onSelect }) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.3)]">
      <h3 className="font-heading text-xl font-bold text-foreground mb-4 flex items-center">
        <span className="inline-block w-[3px] h-5 bg-primary mr-1 translate-y-[2px] rounded-full" />
        Product Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect('all', '')}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
            selectedTag === 'all' 
              ? "bg-primary text-primary-foreground border-primary shadow-md" 
              : "bg-secondary/50 text-primary border-transparent hover:border-primary/30"
          )}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onSelect(tag.slug, tag.name)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
              selectedTag === tag.slug 
                ? "bg-primary text-primary-foreground border-primary shadow-md" 
                : "bg-secondary/50 text-primary border-transparent hover:border-primary/30"
            )}
          >
            #{tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
