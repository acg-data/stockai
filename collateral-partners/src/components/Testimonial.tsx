import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Testimonial() {
  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-center px-[120px] py-[120px] gap-16">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 max-w-[792px]">
        <h2 className="text-[56px] font-bold leading-[120%] tracking-[-0.03em] text-center text-black">
          Testimonials
        </h2>
        <p className="text-lg text-[#7C7C7C] leading-[150%] text-center">
          Real estate funds that closed billion-dollar acquisitions. Private equity firms that raised oversubscribed funds. Hedge funds that won institutional mandates. When the stakes are high, sophisticated firms choose materials that actually work.
        </p>
      </div>

      {/* Testimonial Card */}
      <div className="w-full max-w-[996px] p-2 bg-white rounded-3xl shadow-[0px_4px_8px_rgba(154,154,154,0.24)]">
        <div className="flex items-start p-4 gap-6 bg-black rounded-2xl">
          {/* Left Quote Panel */}
          <div className="flex flex-col items-start p-8 gap-6 bg-[#1C1C1C] rounded-lg flex-1">
            <div className="flex flex-col gap-10">
              {/* Quote */}
              <p className="text-lg text-[#F7F7F7] leading-[150%]">
                Collateral Partners' research capabilities set them apart&mdash;they aggregated bespoke market data and industry intelligence that perfectly supported our investment thesis. Their ability to synthesize complex real estate fundamentals into a compelling fundraising narrative was instrumental in our capital raising success.
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-[168px]">
                <div className="flex items-center gap-[30px]">
                  {/* Name & Title */}
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-bold tracking-[-0.04em] text-white leading-[150%]">
                      Sarah Thomson
                    </span>
                    <span className="text-sm font-medium text-[#7C7C7C] leading-[150%]">
                      Marketing Consultant
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-11 bg-black opacity-10" />

                  {/* Company Logo Placeholder */}
                  <div className="w-[140px] h-11 bg-[#2A2A2A] rounded flex items-center justify-center">
                    <span className="text-xs text-[#555] font-medium">Company Logo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nav Arrows */}
            <div className="flex items-center gap-9">
              <button className="w-10 h-10 bg-white/10 rounded-[10px] flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <ChevronLeft className="w-6 h-6 text-[#1C1C1C]" strokeWidth={1.5} />
              </button>
              <button className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center hover:bg-white/90 transition-colors cursor-pointer">
                <ChevronRight className="w-6 h-6 text-[#1C1C1C]" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-[378px] self-stretch bg-[#F0F0F0] rounded-[20px] overflow-hidden relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E0E0E0] to-[#D0D0D0]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-[#999] font-medium">Portrait Photo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
