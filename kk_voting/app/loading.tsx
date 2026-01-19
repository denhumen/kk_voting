export default function Loading() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-zinc-600 border-t-white animate-spin" />
  
          <p className="text-sm font-alt uppercase tracking-widest text-zinc-400">
            Loading...
          </p>
        </div>
      </div>
    );
}