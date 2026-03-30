import { useState } from 'react'
import type { FormData, StatsData, LifestyleData, FoodData, SnackData, GeminiPlan } from './types'
import { calculatePlan } from './calculations'
import { generatePlan } from './gemini'
import StatsSection from './sections/StatsSection'
import LifestyleSection from './sections/LifestyleSection'
import FoodSection from './sections/FoodSection'
import SnacksSection from './sections/SnacksSection'
import Results from './sections/Results'

const STEPS = [
  { number: 1, label: 'Your Stats', emoji: '📏' },
  { number: 2, label: 'Lifestyle', emoji: '🏃' },
  { number: 3, label: 'Food Prefs', emoji: '🍽️' },
  { number: 4, label: 'Snack Habits', emoji: '🍎' },
  { number: 5, label: 'Your Plan', emoji: '📋' },
]

const defaultStats: StatsData = { age: '', sex: '', heightCm: '', weightKg: '', goalWeight: '', pace: '' }
const defaultLifestyle: LifestyleData = { jobType: '', exercisePerWeek: '', exerciseType: '', sleepHours: '', stressLevel: '', drinksAlcohol: '', alcoholUnitsPerWeek: '' }
const defaultFood: FoodData = { favoriteMeals: '', hatedFoods: '', restrictions: '', cookingStyle: '', adventureLevel: '' }
const defaultSnacks: SnackData = { currentSnacks: '', snackTrigger: '', snackPreference: '', lateNightSnacking: '' }

export default function App() {
  const [step, setStep] = useState(1)
  const [stats, setStats] = useState<StatsData>(defaultStats)
  const [lifestyle, setLifestyle] = useState<LifestyleData>(defaultLifestyle)
  const [food, setFood] = useState<FoodData>(defaultFood)
  const [snacks, setSnacks] = useState<SnackData>(defaultSnacks)
  const [geminiPlan, setGeminiPlan] = useState<GeminiPlan | null>(null)
  const [geminiLoading, setGeminiLoading] = useState(false)
  const [geminiError, setGeminiError] = useState(false)

  const formData: FormData = { stats, lifestyle, food, snacks }
  const plan = step === 5 ? calculatePlan(formData) : null

  const goToResults = () => {
    const calculated = calculatePlan({ stats, lifestyle, food, snacks })
    setStep(5)
    setGeminiPlan(null)
    setGeminiError(false)
    setGeminiLoading(true)
    generatePlan({ stats, lifestyle, food, snacks }, calculated)
      .then(setGeminiPlan)
      .catch(() => setGeminiError(true))
      .finally(() => setGeminiLoading(false))
  }

  const restart = () => {
    setStep(1)
    setStats(defaultStats)
    setLifestyle(defaultLifestyle)
    setFood(defaultFood)
    setSnacks(defaultSnacks)
    setGeminiPlan(null)
    setGeminiError(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥗</span>
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-tight">Nutritionist</h1>
              <p className="text-xs text-gray-400">Your personal fat-loss plan</p>
            </div>
          </div>

          {/* Step Progress */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.number} className="flex items-center gap-0.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.number
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                      : step > s.number
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step > s.number ? '✓' : s.number}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 w-3 transition-colors ${step > s.number ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {step > 1 && (
            <button onClick={restart} className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded hover:bg-gray-100">
              Restart
            </button>
          )}
        </div>
      </header>

      {/* Section Label */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{STEPS[step - 1].emoji}</span>
          <div>
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Step {step} of 5</p>
            <h2 className="text-xl font-bold text-gray-900">{STEPS[step - 1].label}</h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 pb-12">
        {step === 1 && (
          <StatsSection data={stats} onChange={setStats} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <LifestyleSection data={lifestyle} onChange={setLifestyle} onNext={() => setStep(3)} onBack={() => setStep(1)} />
        )}
        {step === 3 && (
          <FoodSection data={food} onChange={setFood} onNext={() => setStep(4)} onBack={() => setStep(2)} />
        )}
        {step === 4 && (
          <SnacksSection data={snacks} onChange={setSnacks} onNext={goToResults} onBack={() => setStep(3)} />
        )}
        {step === 5 && plan && (
          <Results formData={formData} plan={plan} geminiPlan={geminiPlan} geminiLoading={geminiLoading} geminiError={geminiError} onRestart={restart} />
        )}
      </main>
    </div>
  )
}
