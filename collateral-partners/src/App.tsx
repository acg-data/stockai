import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LogoBar from './components/LogoBar'
import Solutions from './components/Solutions'
import WhyChooseUs from './components/WhyChooseUs'
import StatsBanner from './components/StatsBanner'
import ProcessCards from './components/ProcessCards'
import IndustryCards from './components/IndustryCards'
import Testimonial from './components/Testimonial'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

function App() {
  return (
    <div className="flex flex-col items-center w-full bg-[#F0F0F0] min-h-screen">
      <Navbar />
      <Hero />
      <LogoBar />
      <Solutions />
      <WhyChooseUs />
      <StatsBanner />
      <ProcessCards />
      <IndustryCards />
      <Testimonial />
      <CTASection />
      <Footer />
    </div>
  )
}

export default App
