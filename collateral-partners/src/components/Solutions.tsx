import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

const tabs = [
  'Transaction Readiness',
  'Investor Relations',
  'Business Development',
  'Strategic Positioning',
]

const tabContent: Record<string, {
  title: string
  items: { heading: string; description: string }[]
}> = {
  'Transaction Readiness': {
    title: 'Transaction Readiness',
    items: [
      {
        heading: 'Investment Memorandums',
        description: 'Deal books that secure funding and close acquisitions by presenting clear investment cases backed by data and strategic rationale.',
      },
      {
        heading: 'Management Presentations',
        description: 'Executive pitch decks that drive M&A processes by articulating company value, market position, and growth potential.',
      },
      {
        heading: 'Company Profiles',
        description: 'Strategic overviews that position firms for sale, partnership, or investment by highlighting competitive advantages and value drivers.',
      },
    ],
  },
  'Investor Relations': {
    title: 'Investor Relations',
    items: [
      {
        heading: 'Quarterly Reports',
        description: 'Performance narratives that maintain LP confidence and demonstrate consistent value creation across market cycles.',
      },
      {
        heading: 'Annual Reviews',
        description: 'Comprehensive overviews that showcase portfolio performance, strategic direction, and institutional-grade governance.',
      },
      {
        heading: 'Investor Updates',
        description: 'Timely communications that keep stakeholders informed on portfolio developments, market insights, and fund performance.',
      },
    ],
  },
  'Business Development': {
    title: 'Business Development',
    items: [
      {
        heading: 'Pitch Decks',
        description: 'Compelling presentations that articulate your firm\'s value proposition and differentiation to prospective partners and clients.',
      },
      {
        heading: 'Capability Statements',
        description: 'Professional overviews that position your firm\'s expertise, track record, and competitive advantages for new business opportunities.',
      },
      {
        heading: 'Partnership Proposals',
        description: 'Strategic proposals that outline mutual value creation opportunities and demonstrate alignment with prospective partners.',
      },
    ],
  },
  'Strategic Positioning': {
    title: 'Strategic Positioning',
    items: [
      {
        heading: 'Brand Narratives',
        description: 'Foundational messaging that defines your firm\'s identity, voice, and market position with clarity and conviction.',
      },
      {
        heading: 'Market Research Reports',
        description: 'Data-driven insights that identify opportunities, validate strategies, and support informed decision-making.',
      },
      {
        heading: 'Thought Leadership',
        description: 'Expert perspectives that establish authority, build credibility, and drive engagement across your target audience.',
      },
    ],
  },
}

export default function Solutions() {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const content = tabContent[activeTab]

  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-center px-[120px] py-[120px] gap-16">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 max-w-[792px]">
        <h2 className="text-[56px] font-bold leading-[120%] tracking-[-0.03em] text-center text-black">
          Top providers trusted by growing teams
        </h2>
        <p className="text-lg text-[#7C7C7C] leading-[150%] text-center">
          Combining strategic storytelling, deep industry research, and world-class design to turn complex ideas into clear, confident communication.
        </p>
      </div>

      {/* Tabs + Content */}
      <div className="flex flex-col items-center gap-4 w-full max-w-[996px]">
        {/* Tab Bar */}
        <div className="flex items-start p-2 gap-4 bg-black rounded-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center justify-center px-4 py-4 rounded-full text-base text-center transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white text-black font-bold'
                  : 'bg-[#1C1C1C] text-white font-normal hover:bg-[#2C2C2C]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Card */}
        <div className="w-full p-2 bg-white rounded-3xl shadow-[0px_4px_8px_rgba(154,154,154,0.24)]">
          <div className="flex items-start p-6 gap-6 bg-black rounded-2xl min-h-[585px]">
            {/* Left Text Panel */}
            <div className="flex flex-col items-start p-8 gap-6 flex-1 min-h-[537px]">
              <h3 className="text-4xl font-bold text-white tracking-[-0.01em]">
                {content.title}
              </h3>

              <div className="flex flex-col gap-4 w-full">
                {content.items.map((item) => (
                  <div key={item.heading} className="flex flex-col gap-2">
                    <h4 className="text-base font-bold text-white">{item.heading}</h4>
                    <p className="text-base text-[#7C7C7C] leading-[19px]">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* Repeated description for extra visual weight like the spec */}
              <p className="text-base text-[#7C7C7C] leading-[19px]">
                {content.items[0].description}
              </p>

              <button className="flex items-center gap-1 text-lg font-semibold text-white hover:opacity-80 transition-opacity cursor-pointer">
                Explore Solutions
                <ArrowRight className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            {/* Right Image Panel */}
            <div className="w-[454px] min-h-[537px] bg-[#1C1C1C] rounded-lg relative overflow-hidden flex-shrink-0">
              {/* Stacked rotated image placeholders */}
              <div className="absolute w-[586px] h-[386px] left-1/2 top-0 -translate-x-[45%] -rotate-[9.92deg] bg-[#2A2A2A] rounded-lg border border-[#333]" />
              <div className="absolute w-[586px] h-[386px] left-1/2 top-[65px] -translate-x-[40%] -rotate-[9.92deg] bg-[#333] rounded-lg border border-[#444]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
