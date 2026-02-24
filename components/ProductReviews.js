"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { Star, Send, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchAPI } from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const reviewSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  text: z.string().max(1000).optional(),
  rating: z.number().min(1, "Rating is required").max(5)
});

export default function ProductReviews({ productId, reviews = [] }) {
  const { t } = useTranslation();
  const [newReview, setNewReview] = useState({ name: "", email: "", text: "", rating: 5 });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [visibleCount, setVisibleCount] = useState(3);
  
  const approvedReviews = [...reviews]
    .filter(r => r.is_approved)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));
  
  const displayedReviews = approvedReviews.slice(0, visibleCount);
  const hasMore = visibleCount < approvedReviews.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = reviewSchema.safeParse({
      name: newReview.name,
      email: newReview.email,
      text: newReview.text || undefined,
      rating: newReview.rating
    });
    
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    try {
      const slug = `${newReview.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      
      await fetchAPI("/reviews", {
        method: "POST",
        body: JSON.stringify({
          data: {
            name: newReview.name,
            slug: slug,
            email: newReview.email,
            review: newReview.text || "",
            rating: newReview.rating,
            is_approved: false,
            product: productId
          }
        })
      });
      
      toast.success(t('products.reviews.form.success') || "Review submitted successfully!");
      setNewReview({ name: "", email: "", text: "", rating: 5 });
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error(t('products.reviews.form.error') || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="relative bg-card rounded-lg overflow-hidden z-10" style={{ boxShadow: '0 4px 15px rgba(var(--color-primary-rgb), 0.1)' }}>
        <div className="p-8 lg:p-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <div className="w-[3px] h-6 bg-primary rounded-full" />
            {t('products.details.reviews')}
          </h3>

          

          {/* Reviews List */}
          <div className="space-y-6 mb-10">
            {displayedReviews.length > 0 ? (
              <>
                {displayedReviews.map((review) => (
                  <div key={review.id} className="pb-6 border-b border-border last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold">{review.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{review.name}</p>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={cn(
                                  "w-3 h-3",
                                  star <= review.rating ? "fill-primary text-primary" : "text-muted"
                                )} 
                              />
                            ))}
                            <span className="text-xs text-primary ml-1 font-medium">({review.rating})</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.createdAt?.split('T')[0]}</span>
                    </div>
                    <p className="text-foreground mt-2">{review.review}</p>
                  </div>
                ))}

                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="ghost" 
                      onClick={handleLoadMore}
                      className="text-primary font-bold hover:bg-primary/5 rounded-full px-8 py-6 flex items-center gap-2 transition-all active:scale-95"
                    >
                      {t('common.viewMore') || 'Load More'}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-center py-8">{t('products.reviews.noReviews')}</p>
            )}
          </div>

          {/* Add Review Form */}
          <div className="bg-secondary rounded-xl p-6 lg:p-8">
            <h4 className="text-lg font-bold mb-4">{t('products.reviews.form.title')}</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">{t('products.reviews.form.rating')}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || newReview.rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={cn(
                            "w-6 h-6 transition-colors",
                            isFilled ? "fill-primary text-primary" : "text-primary"
                          )} 
                          fill={isFilled ? "currentColor" : "none"}
                        />
                      </button>
                    );
                  })}
                  <span className="text-primary font-medium ml-2">({hoverRating || newReview.rating})</span>
                </div>
                {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t('products.reviews.form.name')}</label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none",
                      errors.name ? "border-red-500" : "border-input"
                    )}
                    placeholder={t('products.reviews.form.namePlaceholder')}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('products.reviews.form.email')}</label>
                  <input
                    type="email"
                    value={newReview.email}
                    onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none",
                      errors.email ? "border-red-500" : "border-input"
                    )}
                    placeholder={t('products.reviews.form.emailPlaceholder')}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('products.reviews.form.review')}</label>
                <textarea
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                  placeholder={t('products.reviews.form.reviewPlaceholder')}
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? t('products.reviews.form.submitting') : t('products.reviews.form.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
