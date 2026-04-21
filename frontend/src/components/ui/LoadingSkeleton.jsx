function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 h-48 rounded-xl bg-slate-200" />
          <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
          <div className="mb-4 h-4 w-1/2 rounded bg-slate-200" />
          <div className="h-10 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
