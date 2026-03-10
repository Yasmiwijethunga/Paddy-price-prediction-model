import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Sprout, TrendingUp, BarChart2, Database, Shield,
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
  {
    url: paddyImg1,
    label: 'Paddy Fields — Sri Lanka',
  },
  {
    url: paddyImg2,
    label: 'Maha Season Harvest',
  },
  {
    url: paddyImg3,
    label: 'Agricultural Research — Anuradhapura',
  },
  {
    url: paddyImg4,
    label: 'Nadu Variety Cultivation',
  },
]

const features = [
  {
    icon: TrendingUp,
    title: 'Price Prediction',
    desc: 'AI-powered forecasting of Nadu paddy farmgate prices using machine learning algorithms.',
  },
  {
    icon: BarChart2,
    title: 'Historical Analysis',
    desc: 'Explore 10-year trends in production, climate, input costs, and price correlations.',
  },
  {
    icon: Database,
    title: 'Data Management',
    desc: 'Manage multi-source datasets from DCS, HARTI, DoM, and MoA in one place.',
  },
  {
    icon: Shield,
    title: 'Research Grade',
    desc: 'Built for researchers with 92.2% model accuracy and transparent factor analysis.',
  },
]

const stats = [
  { value: '92.2%', label: 'Model Accuracy' },
  { value: '10 yrs', label: 'Data Range (2015–2024)' },
  { value: 'Rs.3,650', label: 'Latest Farmgate Price/kg' },
  { value: '118K MT', label: 'Avg. Production Volume' },
]

export default function LandingPage() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setCurrent(c => (c + 1) % SLIDES.length)

  return (
    <div className="min-h-screen flex flex-col font-sans">

      {/* ── Glassmorphism Navbar (fixed) ─────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10 px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center shadow-lg">
            <Sprout size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight text-white">Paddy Price</p>
            <p className="text-xs text-white/50">Prediction System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-white/80 hover:text-white transition-colors px-3 py-2">
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-lg"
          >
            Get Started
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
              Anuradhapura District &bull; Nadu Variety &bull; Maha Season
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5 text-white">
              Paddy Price<br />
              <span className="text-amber-400">Prediction System</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              A data-driven research platform for predicting Nadu paddy farmgate prices using
              historical agricultural, climate, and economic data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25"
              >
                Start Predicting <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto backdrop-blur-sm bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl transition-all"
              >
                Sign In to Dashboard
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
      <section className="bg-[#1a2e1e] py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <p className="text-3xl font-extrabold text-amber-400">{value}</p>
              <p className="text-sm text-white/55 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary-50 to-[#e8f4e8]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Research-Grade Features</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Everything you need to analyze, predict, and report on Nadu paddy prices.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group backdrop-blur-sm bg-white/70 border border-white/80 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 bg-primary-600/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-600/20 transition-colors">
                  <Icon size={22} className="text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Three simple steps to get your paddy price prediction</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Input Parameters', desc: 'Provide production volume, climate data, input costs, and demand figures.' },
              { step: '02', title: 'Run Prediction', desc: 'Our ML model analyzes historical patterns and computes the predicted farmgate price.' },
              { step: '03', title: 'View Results', desc: 'Get price range, confidence level, and contributing factor analysis instantly.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-5 shadow-lg group-hover:shadow-primary-600/30 transition-shadow">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative bg-[#1a2e1e] text-white py-20 px-6 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 50%, #F5A623 0%, transparent 55%), radial-gradient(circle at 85% 50%, #2D6A4F 0%, transparent 55%)',
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Predict Paddy Prices?</h2>
          <p className="text-white/55 mb-8 text-base">
            Join researchers and analysts using data-driven insights for the Anuradhapura district Maha season.
          </p>
          <div className="flex flex-wrap justify-center gap-5 mb-10">
            {['Free to use', 'No credit card', '92.2% accuracy', 'Real research data'].map(item => (
              <span key={item} className="flex items-center gap-1.5 text-sm text-white/65">
                <CheckCircle size={14} className="text-amber-400" /> {item}
              </span>
            ))}
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-10 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 text-base"
          >
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="bg-[#141f18] text-white/35 py-6 px-6 text-center text-sm">
        <p>© 2025 Paddy Price Prediction System — Anuradhapura District, Sri Lanka</p>
      </footer>
    </div>
  )
}
