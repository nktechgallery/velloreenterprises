export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#050505]">
      <div className="text-center">
        <span className="mx-auto block h-12 w-12 animate-spin rounded-full border-2 border-[#c9a227] border-t-transparent" />
        <p className="mt-5 text-xs uppercase tracking-[0.2em] text-white/45 font-condensed font-bold">
          Loading
        </p>
      </div>
    </main>
  );
}
