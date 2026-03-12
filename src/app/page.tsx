import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import WelcomeSection from '@/components/WelcomeSection'
import ProductSection from '@/components/ProductSection'
import ContactSection from '@/components/ContactSection'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <WelcomeSection />
        <ProductSection />
        <ContactSection />
      </main>
    </>
  )
}