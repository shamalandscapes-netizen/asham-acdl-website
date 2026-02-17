// components/blog/BlogSkeleton.tsx
export default function BlogSkeleton() {
  return (
    <main className="p-4 mx-auto mb-20 space-y-16 lg:space-y-24 max-w-7xl lg:p-12">
      {/* Header skeleton */}
      <div className="flex items-end justify-between pt-8">
        <div className="space-y-4">
          <div className="w-32 h-4 bg-gray-200 animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
        </div>
        <div className="w-64 h-12 bg-gray-200 animate-pulse"></div>
      </div>

      {/* Featured post skeleton */}
      <div className="h-[500px] bg-gray-200 animate-pulse rounded-[3.5rem]"></div>

      {/* Pillars skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-[2rem]"></div>
        ))}
      </div>

      {/* Archive skeleton */}
      <div className="space-y-8">
        <div className="w-48 h-6 bg-gray-200 animate-pulse"></div>
        <div className="grid grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/5] bg-gray-200 animate-pulse rounded-[2rem]"></div>
              <div className="w-3/4 h-6 bg-gray-200 animate-pulse"></div>
              <div className="w-full h-4 bg-gray-200 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}