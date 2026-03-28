export default function DashboardLoading() {
  return (
    <div className="p-6 space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-48 skeleton rounded-lg" />
          <div className="h-4 w-32 skeleton rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 skeleton rounded-lg" />
          <div className="h-9 w-24 skeleton rounded-lg" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 skeleton rounded-xl" />
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-64 skeleton rounded-xl" />
          <div className="h-48 skeleton rounded-xl" />
        </div>
        <div className="h-80 skeleton rounded-xl" />
      </div>
    </div>
  );
}
