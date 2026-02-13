import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="w-full max-w-[1440px] mx-auto flex items-center px-[120px] gap-20 h-[800px] relative overflow-hidden">
      {/* Left Content */}
      <div className="flex flex-col justify-center items-start gap-10 w-[690px] z-10">
        <h1 className="text-[80px] font-bold leading-[104%] tracking-[-0.03em] capitalize text-black">
          Clear Stories That Close Deals
        </h1>
        <p className="text-lg text-[#7C7C7C] leading-[150%]">
          Enable your firm to compete and win across every front with deal-winning narratives that turn complex strategies into capital raises and institutional credibility.
        </p>
        <div className="flex items-center gap-4 w-full">
          <button className="flex items-center justify-center gap-4 px-6 py-4 bg-black text-white rounded-full text-lg font-semibold leading-[22px] h-14 hover:bg-[#1C1C1C] transition-colors cursor-pointer">
            GET FREE QUOTE
            <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <button className="flex items-center justify-center gap-4 px-6 py-4 bg-white border border-[#E8E8E8] text-black rounded-full text-lg font-semibold leading-[22px] h-14 hover:bg-[#F7F7F7] transition-colors cursor-pointer">
            CONTACT US
            <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Right Image Area */}
      <div className="absolute right-0 top-0 w-[603px] h-[800px]">
        <div className="w-full h-full bg-[#D9D9D9] relative overflow-hidden">
          {/* Decorative rotated element */}
          <div className="absolute w-[1200px] h-[1000px] left-1/2 top-[-200px] -translate-x-1/3 -rotate-[39deg] bg-gradient-to-br from-[#E0E0E0] via-[#C8C8C8] to-[#D9D9D9] opacity-60" />
          {/* Top fade */}
          <div className="absolute top-0 left-[200px] w-[404px] h-[131px] bg-gradient-to-b from-[#F0F0F0] to-transparent" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 w-full h-[125px] bg-gradient-to-t from-[#F0F0F0] to-transparent" />
        </div>
      </div>
    </section>
  )
}
