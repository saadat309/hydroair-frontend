export default function Loading() {
  return (
    <div className="container py-8 pt-24">
      <div className="h-12 w-64 bg-muted rounded-lg animate-pulse mb-8" />
      
      <div className="flex flex-wrap gap-3 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-24 bg-muted rounded-full animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl overflow-hidden">
            <div className="aspect-square bg-muted animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
