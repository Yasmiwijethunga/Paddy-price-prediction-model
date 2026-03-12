import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Sprout, TrendingUp, BarChart2, Lightbulb,
  ArrowRight, CheckCircle, ChevronLeft, ChevronRight,
} from 'lucide-react'
import paddyImg1 from '../../assets/paddyimage.jpg'
import paddyImg2 from '../../assets/paddyimage2.jpg'
import paddyImg3 from '../../assets/paddyimage3.jpg'
import paddyImg4 from '../../assets/paddyimage4.jpg'

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&auto=format&q=80',
    label: 'Nadu Paddy Fields — Anuradhapura District',
  },
  { url: paddyImg1, label: 'Paddy Fields — Sri Lanka' },
  { url: paddyImg2, label: 'Maha Season Harvest' },
  { url: paddyImg3, label: 'Agricultural Research — Anuradhapura' },
  { url: paddyImg4, label: 'Nadu Variety Cultivation' },
]

const FEATURES = [
  { icon: TrendingUp, titleKey: 'landing.features.priceTitle', descKey: 'landing.features.priceDesc', color: 'bg-amber-50 text-amber-600' },
  { icon: BarChart2,  titleKey: 'landing.features.trendTitle', descKey: 'landing.features.trendDesc', color: 'bg-green-50  text-green-600'  },
  { icon: Lightbulb,  titleKey: 'landing.features.adviceTitle',descKey: 'landing.features.adviceDesc',color: 'bg-blue-50   text-blue-600'   },
]

const STEPS = [
  { step: '01', titleKey: 'landing.steps.s1title', descKey: 'landing.steps.s1desc' },
  { step: '02', titleKey: 'landing.steps.s2title', descKey: 'landing.steps.s2desc' },
  { step: '03', titleKey: 'landing.steps.s3title', descKey: 'landing.steps.s3desc' },
]

const STATS = [
  { value: 'Rs. 3,650', labelEn: 'Latest Price / kg',  labelSi: 'නවතම මිල / කිලෝ' },
  { value: '10 yrs',    labelEn: 'Historical Data',     labelSi: 'ඓතිහාසික දත්ත'   },
  { value: '92.2%',     labelEn: 'Model Accuracy',      labelSi: 'නිරවද්‍යතාව'       },
]

export default function LandingPage() {
  const { t, i18n } = useTranslation()
  const [current, setCurrent] = useState(0)
  const isSi = i18n.language?.startsWith('si')

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setCurrent(c => (c + 1) % SLIDES.length)

  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10 px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg">
            <Sprout size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight text-white">{t('landing.hero.title1')}</p>
            <p className="text-xs text-white/50">{t('landing.hero.title2')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={() => i18n.changeLanguage(isSi ? 'en' : 'si')}
            className="text-sm font-bold text-white border border-white/30 hover:border-white/70 hover:text-amber-300 px-3 py-1.5 rounded-lg transition-all backdrop-blur-sm min-w-[48px]"
          >
            {isSi ? 'EN' : 'සිං'}
          </button>
          <Link to="/login" className="text-sm text-white/80 hover:text-white transition-colors px-3 py-2">
            {t('landing.nav.signIn')}
          </Link>
          <Link
            to="/register"
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-lg"
          >
            {t('landing.nav.getStarted')}
          </Link>
        </div>
      </nav>

      {/* ── Hero — Full-screen Slideshow ─────────────────────────── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Slides */}
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${slide.url})` }}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />

        {/* Slide caption */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-white/50 text-xs tracking-widest uppercase">
          {SLIDES[current].label}
        </div>

        {/* Hero glass card */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto w-full">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl px-8 md:px-12 py-10 shadow-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/25 text-amber-300 border border-amber-400/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sprout size={14} />
              {t('landing.hero.badge')}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5 text-white">
              {t('landing.hero.title1')} <span className="text-amber-400">{t('landing.hero.title2')}</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              {t('landing.hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25"
              >
                {t('landing.hero.startBtn')} <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto backdrop-blur-sm bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl transition-all"
              >
                {t('landing.hero.signInBtn')}
              </Link>
            </div>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-amber-400' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <section className="bg-[#1a2e1e] py-10 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4">
          {STATS.map(({ value, labelEn, labelSi }) => (
            <div key={value} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-3xl font-extrabold text-amber-400">{value}</p>
              <p className="text-sm text-white/55 mt-1">{isSi ? labelSi : labelEn}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features — simple 3-card grid ────────────────────────── */}
      <section className="py-14 px-6 bg-gradient-to-br from-primary-50 to-[#e8f4e8]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('landing.features.heading')}</h2>
            <p className="text-gray-500">{t('landing.features.subheading')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, titleKey, descKey, color }) => (
              <div key={titleKey} className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={26} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-base">{t(titleKey)}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="bg-white py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('landing.steps.heading')}</h2>
            <p className="text-gray-500">{t('landing.steps.subheading')}</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map(({ step, titleKey, descKey }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t(titleKey)}</h3>
                <p className="text-sm text-gray-500">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative bg-[#1a2e1e] text-white py-16 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 50%, #F5A623 0%, transparent 55%), radial-gradient(circle at 85% 50%, #2D6A4F 0%, transparent 55%)',
          }}
        />
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">{t('landing.cta.heading')}</h2>
          <p className="text-white/55 mb-7 text-base">{t('landing.cta.sub')}</p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['c1', 'c2', 'c3', 'c4'].map(key => (
              <span key={key} className="flex items-center gap-1.5 text-sm text-white/65">
                <CheckCircle size={14} className="text-amber-400" /> {t(`landing.cta.${key}`)}
              </span>
            ))}
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 text-base"
          >
            {t('landing.cta.btn')} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-[#141f18] text-white/35 py-6 px-6 text-center text-sm">
        <p>{t('landing.footer')}</p>
      </footer>
    </div>
  )
}
