import Hero from '../../components/hero/Hero'
import PromoStrips from '../../components/home/PromoStrips'
import TopCategories from '../../components/home/TopCategories'
import BenefitsSection from '../../components/home/BenefitsSection'

export default function LangHomePage(){
  return (
    <main className="flex-1">
      <Hero />
      <PromoStrips />
      <TopCategories />
      <BenefitsSection />
    </main>
  )
}
