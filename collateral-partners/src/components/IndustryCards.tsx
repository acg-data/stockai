import { ArrowRight } from 'lucide-react'

const industries = [
  {
    badge: 'Real Estate',
    title: 'Elevate Your Real Estate Marketing Collateral',
  },
  {
    badge: 'Private Equity',
    title: 'Institutional-Grade Materials for PE Firms',
  },
  {
    badge: 'Hedge Funds',
    title: 'Win Mandates With Compelling Fund Materials',
  },
]

export default function IndustryCards() {
  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-center px-[120px] py-[120px] gap-16">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 max-w-[792px]">
        <h2 className="text-[56px] font-bold leading-[120%] tracking-[-0.03em] text-center text-black">
          Trusted By Leading Financial Firms
        </h2>
        <p className="text-lg text-[#7C7C7C] leading-[150%] text-center">
          Real estate funds that closed billion-dollar acquisitions. Private equity firms that raised oversubscribed funds. Hedge funds that won institutional mandates. When the stakes are high, sophisticated firms choose materials that actually work.
        </p>
      </div>

      {/* Cards Row */}
      <div className="flex flex-wrap gap-6 w-full max-w-[1200px]">
        {industries.map((industry) => (
          <div
            key={industry.badge}
            className="flex flex-col p-2 bg-[#F7F7F7] rounded-3xl shadow-[0px_4px_8px_rgba(154,154,154,0.24)] flex-1 min-w-[300px]"
          >
            {/* Top Content */}
            <div className="flex flex-col items-start p-4 gap-4 bg-white rounded-t-2xl">
              <span className="inline-flex items-center px-3 py-1 bg-[#F0F0F0] rounded-full text-sm font-bold text-black">
                {industry.badge}
              </span>
              <h4 className="text-2xl font-bold leading-[150%] tracking-[-0.04em] text-black">
                {industry.title}
              </h4>
              <button className="flex items-center gap-0 text-lg font-semibold text-black hover:opacity-70 transition-opacity cursor-pointer">
                Learn More
                <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            {/* Bottom Logo Bar */}
            <div className="flex items-center justify-between p-6 gap-4 bg-black rounded-b-2xl">
              <div className="w-[161px] h-10 bg-[#333] rounded flex items-center justify-center">
                <span className="text-xs text-[#666] font-medium">Client Logo</span>
              </div>
              <div className="w-[42px] h-10 bg-[#333] rounded flex items-center justify-center">
                <span className="text-xs text-[#666] font-medium">Logo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
