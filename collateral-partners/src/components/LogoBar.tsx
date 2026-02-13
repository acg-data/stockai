const logos = ['CapCut', 'OpenAI', 'Stability', 'Hugging Face', 'MidJourney', 'DALL-E']

export default function LogoBar() {
  return (
    <section className="w-full max-w-[1440px] mx-auto flex flex-col items-center px-[120px] py-20">
      <div className="flex flex-wrap justify-center items-center gap-10 w-full">
        {logos.map((name) => (
          <div
            key={name}
            className="flex items-center justify-center h-8 px-4"
          >
            <span className="text-xl font-bold text-black tracking-tight opacity-70 hover:opacity-100 transition-opacity">
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
