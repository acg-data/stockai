import { FileText, Lightbulb, PenTool, BadgeCheck } from 'lucide-react'

const processes = [
  {
    icon: FileText,
    title: 'Research',
    description: 'Market intelligence that reveals where you win. Deep industry insights and data-backed analysis that give your materials clarity, credibility, and substance.',
    checklist: ['Market Intelligence', 'Competitive Analysis', 'Industry Benchmarking', 'Data Aggregation'],
  },
  {
    icon: Lightbulb,
    title: 'Strategy',
    description: 'Investment theses built on logic and clarity. Messaging frameworks that articulate value, align stakeholders, and withstand due diligence across every stage of the process.',
    checklist: ['Investment Thesis Development', 'Messaging Frameworks', 'Stakeholder Alignment', 'Narrative Architecture'],
  },
  {
    icon: PenTool,
    title: 'Design',
    description: 'Sophisticated visuals that match your strategy. Complex ideas transformed into clear, compelling presentations that earn attention and build lasting trust',
    checklist: ['Visual Identity Systems', 'Presentation Design', 'Data Visualization', 'Brand Collateral'],
  },
]

export default function ProcessCards() {
  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-center px-[120px] py-[120px] gap-16">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 max-w-[788px]">
        <h3 className="text-4xl font-bold leading-[100%] tracking-[-0.01em] text-center text-black">
          Turn Complex Strategies Into Presentations That Close Deals
        </h3>
        <p className="text-lg text-[#7C7C7C] leading-[150%] text-center">
          Real estate funds that closed billion-dollar acquisitions. Private equity firms that raised oversubscribed funds. Hedge funds that won institutional mandates. When the stakes are high, sophisticated firms choose materials that actually work.
        </p>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-[1200px]">
        {processes.map((process) => {
          const Icon = process.icon
          return (
            <div
              key={process.title}
              className="flex flex-col p-2 gap-2 bg-[#F7F7F7] rounded-3xl shadow-[0px_4px_8px_rgba(154,154,154,0.24)]"
            >
              {/* Top Section */}
              <div className="flex flex-col items-start p-4 gap-4 bg-white rounded-2xl">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Icon className="w-10 h-10 text-[#1C1C1C]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-2xl font-bold tracking-[-0.04em] text-black">
                    {process.title}
                  </h4>
                  <p className="text-base text-[#7C7C7C] leading-[19px]">
                    {process.description}
                  </p>
                </div>
              </div>

              {/* Checklist Section */}
              <div className="flex flex-col items-start p-4 gap-4 bg-white rounded-2xl">
                <div className="flex flex-col gap-2 w-full">
                  {process.checklist.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <BadgeCheck className="w-6 h-6 text-[#1C1C1C] flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-base text-[#7C7C7C] leading-[19px]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
