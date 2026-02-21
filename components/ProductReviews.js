"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { Star, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductReviews({ productId }) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([
    { id: 1, name: "John D.", rating: 5, text: "Excellent product! The water quality has improved significantly.", date: "2024-01-15" },
    { id: 2, name: "Sarah M.", rating: 4, text: "Good filter, easy to install. Would recommend.", date: "2024-01-10" },
  ]);
  const [newReview, setNewReview] = useState({ name: "", email: "", text: "", rating: 0 });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.email || !newReview.text || newReview.rating === 0) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      const review = {
        id: Date.now(),
        name: newReview.name,
        rating: newReview.rating,
        text: newReview.text,
        date: new Date().toISOString().split('T')[0]
      };
      setReviews([review, ...reviews]);
      setNewReview({ name: "", email: "", text: "", rating: 0 });
      setIsSubmitting(false);
    }, 1000);
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <div>
      <div className="relative bg-card rounded-lg overflow-hidden z-10" style={{ boxShadow: '0 4px 15px rgba(var(--color-primary-rgb), 0.1)' }}>
        <div className="p-8 lg:p-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <div className="w-[3px] h-6 bg-primary rounded-full" />
            {t('products.details.reviews')}
          </h3>

          {/* Rating Summary */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">{averageRating}</p>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={cn(
                      "w-4 h-4",
                      star <= Math.round(averageRating) ? "fill-primary text-primary" : "text-muted"
                    )} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6 mb-10">
            {reviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-border last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">{review.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={cn(
                              "w-3 h-3",
                              star <= review.rating ? "fill-primary text-primary" : "text-muted"
                            )} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-foreground mt-2">{review.text}</p>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <div className="bg-secondary rounded-xl p-6 lg:p-8">
            <h4 className="text-lg font-bold mb-4">Write a Review</h4>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
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
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={newReview.email}
                    onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="Your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review</label>
                <textarea
                  value={newReview.text}
                  onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                  placeholder="Share your experience with this product..."
                  rows={4}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !newReview.name || !newReview.email || !newReview.text || newReview.rating === 0}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
