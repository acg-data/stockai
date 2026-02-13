import { FileText, Lightbulb, PenTool, BarChart3, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'Built for Finance',
    description: 'Deal books that secure funding and close acquisitions by presenting clear investment cases backed by data and strategic rationale.',
  },
  {
    icon: Lightbulb,
    title: 'Strategic Clarity',
    description: 'Investment theses built on logic and clarity. Messaging frameworks that articulate value and withstand due diligence.',
  },
  {
    icon: PenTool,
    title: 'World-Class Design',
    description: 'Sophisticated visuals that match your strategy. Complex ideas transformed into compelling presentations that earn attention.',
  },
  {
    icon: BarChart3,
    title: 'Data-Driven Research',
    description: 'Market intelligence that reveals where you win. Deep industry insights and data-backed analysis that give your materials substance.',
  },
  {
    icon: Shield,
    title: 'Institutional Quality',
    description: 'Materials that meet the standards of the most discerning institutional investors, from sovereign wealth funds to pension allocators.',
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    description: 'Efficient processes and deep expertise mean faster delivery without compromising quality. Meet your deadlines with confidence.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-center px-[120px] py-[120px] gap-16">
      {/* Header */}
      <div className="flex flex-col items-center gap-6">
        <h2 className="text-[56px] font-bold leading-[120%] tracking-[-0.03em] text-center text-black max-w-[588px]">
          Why Choose Collateral Partners?
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-[1200px]">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="flex flex-col p-2 gap-2 bg-[#F7F7F7] rounded-3xl shadow-[0px_4px_8px_rgba(154,154,154,0.24)]"
            >
              <div className="flex flex-col items-start p-4 gap-4 bg-white rounded-2xl">
                {/* Icon */}
                <div className="w-12 h-12 flex items-center justify-center">
                  <Icon className="w-10 h-10 text-[#1C1C1C]" strokeWidth={1.5} />
                </div>

                {/* Text */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-2xl font-bold tracking-[-0.04em] text-black">
                    {feature.title}
                  </h4>
                  <p className="text-base text-[#7C7C7C] leading-[19px]">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
