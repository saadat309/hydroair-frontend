import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ rating, showValue = false, size = "default", showInBrackets = false }) {
  const sizeClasses = {
    small: "w-3 h-3",
    default: "w-4 h-4",
    large: "w-6 h-6"
  };
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  const displayValue = showInBrackets ? `(${rating.toFixed(1)})` : rating.toFixed(1);
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(sizeClasses[size], "text-primary fill-primary")}
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className={cn(sizeClasses[size], "text-primary")} />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className={cn(sizeClasses[size], "text-primary fill-primary")} />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(sizeClasses[size], "text-primary")}
            fill="none"
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-primary">
          {displayValue}
        </span>
      )}
    </div>
  );
}
