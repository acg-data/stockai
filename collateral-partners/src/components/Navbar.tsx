import { ArrowRight } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-[120px] py-8 h-[104px]">
      {/* Logo */}
      <div className="w-[216px] h-8 flex items-center">
        <span className="text-2xl font-bold tracking-tight text-black">
          Collateral<span className="font-normal text-[#7C7C7C]"> Partners</span>
        </span>
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-4">
        <a href="#" className="text-lg text-[#1C1C1C] leading-[150%]">Home</a>
        <a href="#" className="text-lg text-[#7C7C7C] leading-[150%] hover:text-[#1C1C1C] transition-colors">Who we serve</a>
        <a href="#" className="text-lg text-[#7C7C7C] leading-[150%] hover:text-[#1C1C1C] transition-colors">Solutions</a>
        <a href="#" className="text-lg text-[#7C7C7C] leading-[150%] hover:text-[#1C1C1C] transition-colors">Resources</a>
      </div>

      {/* CTA Buttons */}
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-full text-lg font-semibold leading-[22px] h-10 hover:bg-[#1C1C1C] transition-colors cursor-pointer">
          GET FREE QUOTE
          <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#E8E8E8] text-black rounded-full text-lg font-semibold leading-[22px] h-10 hover:bg-[#F7F7F7] transition-colors cursor-pointer">
          CONTACT US
          <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>
    </nav>
  )
}
