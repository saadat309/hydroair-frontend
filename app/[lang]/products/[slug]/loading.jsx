export default function Loading() {
  return (
    <div className="container py-8 pt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-xl animate-pulse" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-20 h-20 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-6 w-1/4 bg-muted rounded animate-pulse" />
          <div className="h-6 w-1/3 bg-muted rounded animate-pulse" />
          
          <div className="space-y-2 pt-4">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
          </div>
          
          <div className="h-12 w-48 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
