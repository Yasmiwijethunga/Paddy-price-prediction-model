import { Link } from 'react-router-dom'
import { Sprout, TrendingUp, BarChart2, Database, Shield, ArrowRight, CheckCircle } from 'lucide-react'

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
  { value: 'Rs.68', label: 'Latest Farmgate Price/kg' },
  { value: '354K MT', label: 'Avg. Production Volume' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F3]">
      {/* Navbar */}
      <nav className="bg-[#1a2e1e] text-white px-6 md:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
            <Sprout size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">Paddy Price</p>
            <p className="text-xs text-gray-400">Prediction System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-2">
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#1a2e1e] text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Sprout size={14} />
            Anuradhapura District • Nadu Variety • Maha Season
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Paddy Price<br />
            <span className="text-amber-400">Prediction System</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            A data-driven research platform for predicting Nadu paddy farmgate prices in
            Anuradhapura District using historical agricultural, climate, and economic data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Start Predicting <ArrowRight size={18} />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200 py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-primary-600">{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Research-Grade Features</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Everything you need to analyze, predict, and report on Nadu paddy prices.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <Icon size={22} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Three simple steps to get your paddy price prediction</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Input Parameters', desc: 'Provide production volume, climate data, input costs, and demand figures.' },
              { step: '02', title: 'Run Prediction', desc: 'Our ML model analyzes historical patterns and computes the predicted farmgate price.' },
              { step: '03', title: 'View Results', desc: 'Get price range, confidence level, and contributing factor analysis instantly.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a2e1e] text-white py-14 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Predict Paddy Prices?</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Join researchers and analysts using data-driven insights for the Anuradhapura district Maha season.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['Free to use', 'No credit card', '92.2% accuracy', 'Real research data'].map(item => (
            <span key={item} className="flex items-center gap-1.5 text-sm text-gray-300">
              <CheckCircle size={14} className="text-amber-400" /> {item}
            </span>
          ))}
        </div>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Create Free Account <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#141f18] text-gray-500 py-6 px-6 text-center text-sm">
        <p>© 2025 Paddy Price Prediction System — Anuradhapura District, Sri Lanka</p>
      </footer>
    </div>
  )
}
