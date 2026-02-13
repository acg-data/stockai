import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="w-full max-w-[1440px] mx-auto flex items-center px-[120px] gap-16 py-[120px] bg-black relative overflow-hidden isolate">
      {/* Left Content */}
      <div className="flex flex-col items-start gap-10 max-w-[588px] z-10">
        <div className="flex flex-col justify-center items-start gap-6">
          <h2 className="text-[56px] font-bold leading-[120%] tracking-[-0.03em] text-white">
            Your Next Deal Starts With Better Collateral
          </h2>
          <p className="text-[22px] text-[#7C7C7C] leading-[27px]">
            Great strategies get overlooked when they're not presented the right way. Don't let weak communication cost you the allocation.
          </p>
        </div>
        <button className="flex items-center justify-center gap-4 px-6 py-4 bg-white border border-[#E8E8E8] rounded-full text-lg font-semibold text-black h-14 hover:bg-[#F7F7F7] transition-colors cursor-pointer">
          SCHEDULE A CALL
          <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>

      {/* Right Decorative Element */}
      <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 -translate-y-[108px] w-[913px] h-[913px] rotate-[12.83deg] z-[1]">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1A1A1A] via-[#222] to-[#111] opacity-40" />
      </div>
    </section>
  )
}
