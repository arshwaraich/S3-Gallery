export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20" style={{ borderTopColor: 'var(--ios-blue)' }}></div>
        <p className="mt-4 ios-secondary text-sm font-medium">Loading your photos...</p>
      </div>
    </div>
  );
}