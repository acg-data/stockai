import { ArrowRight, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full max-w-[1440px] mx-auto flex justify-between items-start px-[120px] py-20 bg-black gap-2">
      {/* Column 1: Logo + Description + Social */}
      <div className="flex flex-col items-start gap-4 w-[216px]">
        <div className="w-[216px] h-8 flex items-center">
          <span className="text-2xl font-bold tracking-tight text-white">
            Collateral<span className="font-normal text-[#7C7C7C]"> Partners</span>
          </span>
        </div>
        <p className="text-base text-[#F0F0F0] leading-[19px]">
          Collateral Partners provides financial communications advisory services for finance firms.
        </p>
        <div className="flex items-start gap-4">
          <a href="#" className="w-6 h-6 text-[#F0F0F0] hover:text-white transition-colors">
            <Linkedin className="w-6 h-6" strokeWidth={1.5} />
          </a>
          <a href="#" className="w-6 h-6 text-[#F0F0F0] hover:text-white transition-colors">
            <Twitter className="w-6 h-6" strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {/* Column 2: Navigation */}
      <div className="flex flex-col justify-center items-start gap-4">
        <a href="#" className="text-lg text-[#7C7C7C] leading-[150%] hover:text-white transition-colors">Home</a>
        <a href="#" className="text-lg text-white leading-[150%] hover:text-[#F0F0F0] transition-colors">Who we serve</a>
        <a href="#" className="text-lg text-white leading-[150%] hover:text-[#F0F0F0] transition-colors">Solutions</a>
        <a href="#" className="text-lg text-white leading-[150%] hover:text-[#F0F0F0] transition-colors">Resources</a>
      </div>

      {/* Column 3: Navigation */}
      <div className="flex flex-col justify-center items-start gap-4">
        <a href="#" className="text-lg text-[#7C7C7C] leading-[150%] hover:text-white transition-colors">Home</a>
        <a href="#" className="text-lg text-white leading-[150%] hover:text-[#F0F0F0] transition-colors">Who we serve</a>
        <a href="#" className="text-lg text-white leading-[150%] hover:text-[#F0F0F0] transition-colors">Solutions</a>
        <a href="#" className="text-lg text-white leading-[150%] hover:text-[#F0F0F0] transition-colors">Resources</a>
      </div>

      {/* Column 4: CTA Buttons */}
      <div className="flex flex-col justify-center items-start gap-4">
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#E8E8E8] text-black rounded-full text-lg font-semibold leading-[22px] h-10 hover:bg-[#F7F7F7] transition-colors cursor-pointer">
          GET FREE QUOTE
          <ArrowRight className="w-6 h-6 text-[#1C1C1C]" strokeWidth={1.5} />
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#E8E8E8] text-black rounded-full text-lg font-semibold leading-[22px] h-10 hover:bg-[#F7F7F7] transition-colors cursor-pointer">
          CONTACT US
          <ArrowRight className="w-6 h-6 text-[#1C1C1C]" strokeWidth={1.5} />
        </button>
      </div>
    </footer>
  )
}
