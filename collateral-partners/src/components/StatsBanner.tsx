const stats = [
  { value: '$10B+', label: 'Capital Represented in Client Projects' },
  { value: '200+', label: 'Institutional Projects Delivered' },
  { value: '98%', label: 'Client Retention & Satisfaction Rate' },
]

export default function StatsBanner() {
  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-center px-[120px] py-[120px] gap-16 bg-black">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 max-w-[792px]">
        <h2 className="text-[56px] font-bold leading-[120%] tracking-[-0.03em] text-center text-white">
          Chosen By Sophisticated Businesses
        </h2>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-6 w-full max-w-[1200px]">
        {stats.map((stat) => (
          <div key={stat.value} className="flex flex-col items-center gap-4 flex-1">
            <span className="text-[80px] font-bold leading-[104%] tracking-[-0.03em] text-center text-white capitalize">
              {stat.value}
            </span>
            <p className="text-lg text-[#7C7C7C] leading-[150%] text-center w-full">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
