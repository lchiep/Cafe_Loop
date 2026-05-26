export function SkeletonCard() {
  return (
    <div className="min-w-[200px] w-[200px] h-[260px] flex-shrink-0 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
      <div className="skeleton w-full h-full"/>
    </div>
  )
}
export function SkeletonWide() {
  return (
    <div className="w-full h-[320px] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
      <div className="skeleton w-full h-full"/>
    </div>
  )
}
export function SkeletonList() {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100">
      <div className="w-[72px] h-[72px] rounded-xl skeleton flex-shrink-0"/>
      <div className="flex-1 flex flex-col gap-2.5">
        <div className="skeleton h-4 w-3/4 rounded-lg"/>
        <div className="skeleton h-3 w-1/2 rounded-lg"/>
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full"/>
          <div className="skeleton h-5 w-12 rounded-full"/>
        </div>
      </div>
    </div>
  )
}
export function SkeletonDetail() {
  return (
    <div>
      <div className="skeleton h-56 w-full"/>
      <div className="mx-4 -mt-6 bg-white rounded-2xl p-5 shadow-card border border-slate-100">
        <div className="flex justify-around">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="skeleton h-6 w-12 rounded-lg"/>
              <div className="skeleton h-3 w-16 rounded"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
