import type { FormData, NutritionPlan } from '../types'

interface Props {
  formData: FormData
  plan: NutritionPlan
  onRestart: () => void
}

function StatCard({ label, value, unit, color = 'emerald' }: { label: string; value: string | number; unit?: string; color?: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-800',
    blue: 'bg-blue-50 border-blue-100 text-blue-800',
    purple: 'bg-purple-50 border-purple-100 text-purple-800',
    orange: 'bg-orange-50 border-orange-100 text-orange-800',
    teal: 'bg-teal-50 border-teal-100 text-teal-800',
  }
  return (
    <div className={`rounded-xl border p-4 ${colors[color] || colors['emerald']}`}>
      <p className="text-xs font-medium opacity-70 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}<span className="text-sm font-normal ml-1">{unit}</span></p>
    </div>
  )
}

function Section({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 space-y-3">
      <h3 className="flex items-center gap-2 font-bold text-gray-900 text-base">
        <span className="text-xl">{emoji}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Rule({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
        {number}
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
    </div>
  )
}

function SnackSwap({ original, swap, calories }: { original: string; swap: string; calories: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400 line-through flex-none">{original}</span>
      <span className="text-gray-400">→</span>
      <span className="text-gray-800 font-medium">{swap}</span>
      <span className="ml-auto text-emerald-700 font-semibold flex-none">{calories}</span>
    </div>
  )
}

function getMealPlanDays(formData: FormData, plan: NutritionPlan): { day: string; theme: string; emoji: string; meals: { name: string; cals: number; p: number; c: number; f: number; note?: string }[] }[] {
  const c = plan.targetCalories
  const isVeg = formData.food.restrictions?.toLowerCase().includes('veg')
  const favorites = formData.food.favoriteMeals?.toLowerCase() || ''

  const hasAsian = favorites.includes('thai') || favorites.includes('stir') || favorites.includes('asian') || favorites.includes('sushi') || favorites.includes('ramen')
  const hasMediterranean = favorites.includes('greek') || favorites.includes('mediterr') || favorites.includes('pasta') || favorites.includes('italian')
  const hasMexican = favorites.includes('taco') || favorites.includes('mexican') || favorites.includes('burrito')
  const hasIndian = favorites.includes('curry') || favorites.includes('indian') || favorites.includes('tikka')

  const bfast1 = { name: 'Greek yogurt with berries & granola', cals: Math.round(c * 0.22), p: 25, c: 40, f: 8 }
  const bfast2 = { name: 'Scrambled eggs on wholegrain toast with avocado', cals: Math.round(c * 0.24), p: 22, c: 30, f: 14 }
  const bfast3 = { name: 'Protein overnight oats with banana & peanut butter', cals: Math.round(c * 0.23), p: 28, c: 45, f: 10 }
  const bfast4 = { name: 'Smoked salmon & cream cheese on rye', cals: Math.round(c * 0.22), p: 26, c: 28, f: 12, note: isVeg ? undefined : undefined }

  const days = [
    {
      day: 'Monday', theme: hasMediterranean ? 'Mediterranean Monday' : 'Protein Power Monday', emoji: hasMediterranean ? '🫒' : '💪',
      meals: [
        bfast1,
        { name: hasMediterranean ? 'Chicken & hummus wrap with tabbouleh' : 'Turkey & avocado wholegrain wrap', cals: Math.round(c * 0.3), p: 35, c: 38, f: 12 },
        { name: hasMediterranean ? 'Baked salmon with roasted veg & quinoa' : 'Chicken stir fry with brown rice', cals: Math.round(c * 0.38), p: 40, c: 45, f: 15 },
        { name: '🍫 "Treat": Dark chocolate (2 squares) + strawberries', cals: Math.round(c * 0.1), p: 2, c: 18, f: 6, note: 'Secret win — feels indulgent, very low cal!' },
      ]
    },
    {
      day: 'Tuesday', theme: hasMexican ? 'Tex-Mex Tuesday' : 'Flavour Fiesta Tuesday', emoji: '🌮',
      meals: [
        bfast2,
        { name: hasMexican ? 'Black bean & chicken burrito bowl (no tortilla)' : 'Prawn & mango salad with chilli lime dressing', cals: Math.round(c * 0.3), p: 32, c: 42, f: 10 },
        { name: hasMexican ? 'Grilled chicken fajitas in lettuce cups' : 'Spiced turkey tacos with salsa & slaw', cals: Math.round(c * 0.38), p: 42, c: 38, f: 14 },
        { name: '🍮 Vanilla protein pudding with cinnamon', cals: Math.round(c * 0.08), p: 20, c: 12, f: 3 },
      ]
    },
    {
      day: 'Wednesday', theme: hasAsian ? 'Wok Wednesday' : 'Wellness Wednesday', emoji: '🥢',
      meals: [
        bfast3,
        { name: hasAsian ? 'Miso soup + tuna & edamame rice bowl' : 'Chicken & quinoa power salad', cals: Math.round(c * 0.28), p: 34, c: 35, f: 9, note: '📦 Batch: double up for Thursday lunch' },
        { name: hasAsian ? 'Teriyaki salmon with pak choi & steamed rice' : 'Grilled cod with roasted sweet potato & greens', cals: Math.round(c * 0.38), p: 38, c: 48, f: 12 },
        { name: '🍓 Greek yogurt with honey drizzle', cals: Math.round(c * 0.09), p: 12, c: 14, f: 3 },
      ]
    },
    {
      day: 'Thursday', theme: hasIndian ? 'Tikka Thursday' : 'High Protein Thursday', emoji: hasIndian ? '🍛' : '🥩',
      meals: [
        bfast4,
        { name: hasIndian ? 'Chicken tikka salad with raita & flatbread' : 'Leftover batch meal (from Wednesday)', cals: Math.round(c * 0.28), p: 32, c: 36, f: 10, note: '📦 Batch prep win!' },
        { name: hasIndian ? 'Chicken tikka masala (lighter version) with cauliflower rice' : 'Turkey & broccoli with brown rice', cals: Math.round(c * 0.4), p: 44, c: 42, f: 14 },
        { name: '🍎 Apple slices with 2 tbsp almond butter', cals: Math.round(c * 0.09), p: 4, c: 22, f: 8 },
      ]
    },
    {
      day: 'Friday', theme: 'Feel-Good Friday', emoji: '🥳',
      meals: [
        bfast1,
        { name: 'Tuna niçoise salad (no dressing on the side)', cals: Math.round(c * 0.28), p: 34, c: 24, f: 14 },
        { name: '🎉 "Treat night": Homemade chicken burger with sweet potato fries', cals: Math.round(c * 0.4), p: 38, c: 55, f: 16, note: 'Secretly fits perfectly — enjoy it guilt-free!' },
        { name: '🍦 Low-cal ice cream bar (e.g. Halo Top)', cals: Math.round(c * 0.08), p: 6, c: 18, f: 4, note: 'Secret treat — tastes like a cheat, isn\'t!' },
      ]
    },
    {
      day: 'Saturday', theme: 'Social Saturday', emoji: '🌞',
      meals: [
        { name: 'Full protein breakfast: eggs, turkey bacon, grilled tomato & mushroom', cals: Math.round(c * 0.28), p: 38, c: 20, f: 18 },
        { name: 'Big meal prep session — batch cook grains & proteins', cals: Math.round(c * 0.3), p: 36, c: 42, f: 12, note: '📦 Batch: prep for the week ahead!' },
        { name: formData.lifestyle.drinksAlcohol === 'yes' ? 'Lighter dinner: grilled fish & salad (saving cal room for drinks)' : 'Grilled chicken with roasted Mediterranean veg', cals: Math.round(c * 0.32), p: 36, c: 32, f: 12 },
        { name: formData.lifestyle.drinksAlcohol === 'yes' ? '🍺 Drinks budget: 2 light beers or 1 glass wine (~150 kcal)' : '🍇 Fresh fruit salad with mint', cals: Math.round(c * 0.1), p: 2, c: 20, f: 1 },
      ]
    },
    {
      day: 'Sunday', theme: 'Reset Sunday', emoji: '🔄',
      meals: [
        bfast2,
        { name: 'Leftover-based frittata with a big mixed salad', cals: Math.round(c * 0.28), p: 30, c: 22, f: 16 },
        { name: 'Slow-cook chilli (batch cook — freeze half for next week)', cals: Math.round(c * 0.38), p: 42, c: 48, f: 12, note: '📦 Batch: freeze half for a future "lazy" win!' },
        { name: '🍫 Protein brownie or protein shake', cals: Math.round(c * 0.1), p: 20, c: 14, f: 4 },
      ]
    },
  ]

  return days
}

function getSnackSwaps(formData: FormData): { original: string; swap: string; calories: string }[] {
  const current = formData.snacks.currentSnacks?.toLowerCase() || ''
  const pref = formData.snacks.snackPreference

  const swaps = []

  if (current.includes('crisp') || current.includes('chip') || pref === 'savoury' || pref === 'both') {
    swaps.push({ original: 'Regular crisps (~180 kcal)', swap: 'Popcorn (air-popped, lightly salted) · Veggie sticks + hummus', calories: '80–120 kcal' })
  }
  if (current.includes('choc') || current.includes('biscuit') || pref === 'sweet' || pref === 'both') {
    swaps.push({ original: 'Milk chocolate bar (~250 kcal)', swap: '2 squares dark chocolate (85%) + handful of strawberries', calories: '100 kcal' })
    swaps.push({ original: 'Digestive biscuits (~160 kcal each)', swap: 'Rice cakes with peanut butter & banana slices', calories: '120 kcal' })
  }
  if (current.includes('nut') || current.includes('peanut')) {
    swaps.push({ original: 'Handful of nuts (easy to overeat — ~200 kcal)', swap: 'Pre-portioned 20g nut pack or edamame (protein hit!)', calories: '90–120 kcal' })
  }
  if (pref === 'sweet' || pref === 'both') {
    swaps.push({ original: 'Flavoured yogurt (~150 kcal)', swap: 'Plain Greek yogurt + frozen berries + drizzle of honey', calories: '110 kcal' })
  }

  // Always add these power swaps
  swaps.push({ original: 'Vending machine snack (~250+ kcal)', swap: 'Cottage cheese with pineapple chunks (protein powerhouse)', calories: '130 kcal' })
  swaps.push({ original: 'Shop-bought protein bar (~200 kcal)', swap: 'Turkey/chicken slices rolled in lettuce with a blob of mustard', calories: '80 kcal' })
  swaps.push({ original: 'Late-night cereals (~200+ kcal)', swap: 'Casein protein shake or Greek yogurt (keeps you full overnight)', calories: '120 kcal' })

  return swaps.slice(0, 7)
}

function getPersonalRules(formData: FormData, plan: NutritionPlan): string[] {
  const rules: string[] = []
  const { lifestyle, food, snacks, stats } = formData

  // Rule about alcohol
  if (lifestyle.drinksAlcohol === 'yes') {
    const units = parseInt(lifestyle.alcoholUnitsPerWeek) || 0
    if (units > 10) {
      rules.push(`Treat alcohol like a food group. With ~${units} units per week (~${units * 90} kcal), plan your drinks into your daily budget rather than pretending they don't count. Pick 1–2 specific nights, choose lower-cal drinks (spirits + soda, light beer), and eat a protein-rich meal beforehand.`)
    } else {
      rules.push('Log your alcohol calories honestly. A couple of drinks a week is fine — just account for them. Front-load protein on days you drink so you stay full and make better food choices later.')
    }
  }

  // Rule about stress/sleep
  if (lifestyle.sleepHours && parseInt(lifestyle.sleepHours) < 7) {
    rules.push(`Prioritise 7+ hours of sleep. You're currently averaging ${lifestyle.sleepHours}h — poor sleep spikes cortisol, tanks willpower and makes you ~300 kcal hungrier the next day. This one change alone could make or break your results.`)
  } else if (lifestyle.stressLevel === 'high') {
    rules.push('Manage stress actively. High cortisol is a fat-storage hormone. Even 10 minutes of walking, breathing exercises or a quick gym session will make a measurable difference to your results — not just your mood.')
  }

  // Rule about job/activity
  if (lifestyle.jobType === 'desk') {
    rules.push('Move more between meals. With a desk job, your NEAT (non-exercise movement) is low. Take a 10-minute walk after lunch, use a standing desk if possible, or add 5,000 steps on non-gym days. This can add up to 200–300 extra calories burned daily.')
  } else if (lifestyle.jobType === 'manual') {
    rules.push(`Don't underestimate how much you burn at work — but also don't overeat back into a surplus. Your TDEE of ${plan.tdee} kcal already accounts for your physical job. Eat to your ${plan.targetCalories} kcal target consistently, especially on rest days when you burn less.`)
  }

  // Snacking rules
  if (snacks.lateNightSnacking === 'yes') {
    rules.push('Tackle late-night snacking with a game plan. Try brushing your teeth after dinner as a "closed for business" signal, keep a casein protein shake or Greek yogurt ready as a satisfying low-calorie option, and ask yourself if you\'re actually hungry or just bored/tired.')
  }
  if (snacks.snackTrigger === 'boredom' || snacks.snackTrigger === 'habit') {
    rules.push('Create a snack "rule" not a snack "ban". You don\'t need to stop snacking — you need to snack intentionally. Build your 1–2 planned snacks into your calorie target, keep them prepped and portioned, and remove the grab-bag impulse by not having trigger foods in the house.')
  }

  // Cooking style
  if (food.cookingStyle === 'batch') {
    rules.push('Lean into your batch cooking superpower. Cook your proteins and grains on Sunday, portion them into containers, and assembly-line your lunches. People who prep are 3x more likely to hit their nutrition targets on weekdays.')
  } else if (food.cookingStyle === 'quick') {
    rules.push('Master your "emergency meals" — fast, protein-packed options when life gets hectic. Keep Greek yogurt, pre-cooked rice pouches, tinned tuna and frozen veg in stock. A 5-minute bowl that hits your macros is infinitely better than ordering a takeaway.')
  }

  // Goal weight motivation
  if (stats.goalWeight && stats.weightKg) {
    const diff = parseFloat(stats.weightKg) - parseFloat(stats.goalWeight)
    if (diff > 0 && plan.weeksToGoal) {
      rules.push(`Focus on the process, not the scales. You\'re ${diff}kg from your goal. Some weeks you\'ll lose 1.5kg, some weeks 0.2kg — both are wins. Take weekly progress photos, track energy levels, and remember the scale doesn't show fat lost on weeks you're retaining water.`)
    }
  }

  // Fill to 5 rules if needed
  if (rules.length < 5) {
    rules.push('Hit your protein target first, every single day. Protein keeps you full, preserves muscle, and has the highest "thermic effect" — meaning your body burns more calories digesting it. If you do nothing else right, get your protein in.')
  }

  return rules.slice(0, 5)
}

export default function Results({ formData, plan, onRestart }: Props) {
  const { stats, lifestyle } = formData
  const days = getMealPlanDays(formData, plan)
  const snackSwaps = getSnackSwaps(formData)
  const rules = getPersonalRules(formData, plan)

  const weightToLoseKg = parseFloat(stats.weightKg) - parseFloat(stats.goalWeight)
  const months = plan.weeksToGoal ? Math.round(plan.weeksToGoal / 4.3) : null

  return (
    <div className="space-y-5 mt-4">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
        <p className="text-emerald-100 text-sm mb-1">Your personalised plan is ready!</p>
        <h2 className="text-2xl font-bold mb-3">
          Here's your roadmap to {stats.goalWeight ? `${stats.goalWeight}kg` : 'your goal'} 🎯
        </h2>
        <p className="text-emerald-100 text-sm leading-relaxed">
          Based on your stats, lifestyle and food preferences — calculated using the Mifflin-St Jeor formula with a {plan.activityLabel} activity multiplier ({plan.activityMultiplier}×).
        </p>
      </div>

      {/* Calorie Section */}
      <Section emoji="🔥" title="Your Calorie Targets">
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
          ⚠️ <strong>Important:</strong> Online calorie calculators (including this one!) are estimates. They're built assuming average activity levels and can be off by 10–20%. The most accurate method is to track your food for 2 weeks without changing anything — if your weight is stable, <em>that</em> number is your true maintenance. Real-world data always wins.
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span className="text-gray-500">BMR (base metabolic rate)</span>
            <span className="font-semibold">{plan.bmr.toLocaleString()} kcal</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span className="text-gray-500">Activity multiplier ({plan.activityLabel})</span>
            <span className="font-semibold">× {plan.activityMultiplier}</span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
            <span className="text-gray-500">TDEE (maintenance)</span>
            <span className="font-semibold">{plan.tdee.toLocaleString()} kcal</span>
          </div>
          <div className="flex justify-between items-center py-2 bg-emerald-50 rounded-lg px-3 mt-1">
            <span className="font-bold text-emerald-800">Your daily target (500 kcal deficit)</span>
            <span className="font-bold text-emerald-800 text-lg">{plan.targetCalories.toLocaleString()} kcal</span>
          </div>
        </div>
      </Section>

      {/* Macros */}
      <Section emoji="⚖️" title="Daily Macro Targets">
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Protein" value={plan.protein} unit="g" color="blue" />
          <StatCard label="Carbs" value={plan.carbs} unit="g" color="orange" />
          <StatCard label="Fat" value={plan.fat} unit="g" color="purple" />
        </div>
        <div className="text-xs text-gray-500 space-y-1.5 mt-1">
          <p>🥩 <strong>Protein ({plan.protein}g):</strong> Set at 2.2g per kg of goal bodyweight. This is the single most important macro during a cut — it preserves muscle, keeps you full, and costs the most calories to digest.</p>
          <p>🍞 <strong>Carbs ({plan.carbs}g):</strong> Enough to fuel your workouts and support brain function. Front-load them around training for best results.</p>
          <p>🥑 <strong>Fat ({plan.fat}g):</strong> 25% of total calories — essential for hormones, joint health and keeping your meals satisfying.</p>
        </div>
      </Section>

      {/* 7-Day Meal Plan */}
      <Section emoji="📅" title="Your 7-Day Meal Plan">
        <p className="text-xs text-gray-500">Built around your favourites. 📦 = great for batch cooking.</p>
        <div className="space-y-4">
          {days.map(day => (
            <div key={day.day} className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="bg-emerald-600 text-white px-4 py-2 flex items-center gap-2">
                <span>{day.emoji}</span>
                <span className="font-semibold text-sm">{day.day}: {day.theme}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {day.meals.map((meal, i) => (
                  <div key={i} className="px-4 py-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide mr-1.5">
                          {i === 0 ? 'Breakfast' : i === 1 ? 'Lunch' : i === 2 ? 'Dinner' : 'Dessert'}
                        </span>
                        <span className="text-sm text-gray-800">{meal.name}</span>
                        {meal.note && <p className="text-xs text-amber-600 mt-0.5">{meal.note}</p>}
                      </div>
                      <div className="text-right flex-none">
                        <p className="text-sm font-bold text-gray-800">{meal.cals} kcal</p>
                        <p className="text-xs text-gray-400">P:{meal.p}g C:{meal.c}g F:{meal.f}g</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2 bg-gray-50 flex justify-between text-xs font-medium text-gray-600">
                  <span>Daily total</span>
                  <span>≈ {day.meals.reduce((s, m) => s + m.cals, 0)} kcal · P:{day.meals.reduce((s, m) => s + m.p, 0)}g C:{day.meals.reduce((s, m) => s + m.c, 0)}g F:{day.meals.reduce((s, m) => s + m.f, 0)}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Snack Swaps */}
      <Section emoji="🔄" title="Snack Swaps">
        <p className="text-xs text-gray-500">Same itch, fewer calories. Every swap listed is something you'll actually want to eat.</p>
        <div className="space-y-3 bg-gray-50 rounded-xl p-4">
          {snackSwaps.map((swap, i) => (
            <SnackSwap key={i} original={swap.original} swap={swap.swap} calories={swap.calories} />
          ))}
        </div>
      </Section>

      {/* Personal Rules */}
      <Section emoji="📌" title="Your 5 Personal Fat Loss Rules">
        <p className="text-xs text-gray-500">Written specifically for you — not generic advice.</p>
        <div className="space-y-3">
          {rules.map((rule, i) => (
            <Rule key={i} number={i + 1} text={rule} />
          ))}
        </div>
      </Section>

      {/* Timeline */}
      <Section emoji="📈" title="Realistic Timeline">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Weekly fat loss" value={`~${plan.weeklyLoss}kg`} color="emerald" />
          <StatCard label="Estimated goal" value={months ? `~${months} months` : 'Already there!'} color="teal" />
        </div>
        {weightToLoseKg > 0 && plan.weeksToGoal && (
          <div className="text-sm text-gray-600 space-y-2 mt-1">
            <p>📅 <strong>Month 1–2:</strong> Expect 1–2kg gone, energy improving, clothes fitting differently. The scale moves slow at first — don't panic. Water weight fluctuates.</p>
            <p>📅 <strong>Month 3–4:</strong> Results really start showing. If you've been consistent, you could be 4–6kg lighter and feeling significantly better in the gym.</p>
            {months && months > 4 && <p>📅 <strong>Month 5+:</strong> The long game — the people who get here are those who built habits, not willpower. By now your new eating pattern is just... how you eat.</p>}
            <p className="text-xs text-gray-400 pt-1">⚡ These projections assume consistent adherence. Real fat loss is non-linear — some weeks will be faster, some slower. Trust the process.</p>
          </div>
        )}
      </Section>

      {/* Hydration */}
      <Section emoji="💧" title="Daily Hydration Target">
        <StatCard label="Daily water target" value={plan.waterLitres} unit="litres" color="blue" />
        <div className="text-sm text-gray-600 space-y-2 mt-1">
          <p>🔬 <strong>Why it matters:</strong> Being even mildly dehydrated tanks gym performance by up to 20%, triggers false hunger signals (thirst often masquerades as hunger), slows metabolism, and kills energy. Hydration isn't an afterthought — it's a fat loss tool.</p>
          <div className="space-y-1.5">
            <p>✅ <strong>Tip 1:</strong> {lifestyle.jobType === 'manual' || lifestyle.jobType === 'feet' ? 'Keep a 1L bottle at your workstation/locker and refill it twice during your shift.' : 'Keep a 1L bottle on your desk and aim to empty it twice before 5pm.'}</p>
            <p>✅ <strong>Tip 2:</strong> Drink 500ml of water first thing in the morning before coffee or food — your body is dehydrated after sleep.</p>
            <p>✅ <strong>Tip 3:</strong> Have a full glass of water 20–30 minutes before each meal. Studies show this reduces calorie intake by up to 13% at that meal.</p>
            <p>✅ <strong>Tip 4:</strong> If you're exercising, drink an extra 500ml during your session and 250ml for every 30 minutes of training.</p>
          </div>
        </div>
      </Section>

      {/* Supplements */}
      <Section emoji="💊" title="Supplement Recommendations">
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
          🔑 Supplements are the <strong>1%</strong>. Food, training, sleep and consistency are the <strong>99%</strong>. Don't let this section distract you from the basics.
        </div>
        <div className="space-y-3">
          {[
            {
              name: 'Creatine Monohydrate',
              emoji: '💪',
              dose: '3–5g daily',
              timing: 'Any time, consistent daily use',
              why: 'The most researched supplement in existence. Improves strength, power output, muscle retention during a cut, and even cognitive function. Non-negotiable if you\'re training.',
              product: 'MyProtein Creatine Monohydrate — £10–15 for 250 servings. Hard to beat.',
            },
            {
              name: 'Vitamin D3',
              emoji: '☀️',
              dose: '2,000–4,000 IU daily',
              timing: 'With a meal containing fat',
              why: 'Most people in the UK and northern climates are deficient, especially in winter. Low D3 is linked to fatigue, low mood, and impaired fat metabolism — all things that will undermine your results.',
              product: 'BetterYou D3+K2 Oral Spray (£8–12) — excellent bioavailability, no pills needed.',
            },
            ...(parseInt(lifestyle.exercisePerWeek) >= 3 ? [{
              name: 'Omega-3 Fish Oil',
              emoji: '🐟',
              dose: '2–3g EPA/DHA daily',
              timing: 'With meals',
              why: 'Reduces exercise-induced inflammation, supports joint health and recovery, and may improve body composition by slightly enhancing fat oxidation. Especially relevant for your training volume.',
              product: 'Wiley\'s Finest Wild Alaskan Fish Oil or any capsule with 1000mg+ EPA/DHA per serving (£10–15/month).',
            }] : []),
            ...(parseInt(lifestyle.sleepHours) < 7 ? [{
              name: 'Magnesium Glycinate',
              emoji: '🌙',
              dose: '200–400mg elemental magnesium',
              timing: '30–60 mins before bed',
              why: `You mentioned averaging ~${lifestyle.sleepHours} hours of sleep. Magnesium glycinate promotes deeper sleep quality, reduces cortisol at night, and helps with muscle recovery. This isn't just a nice-to-have at your sleep level.`,
              product: 'Bulk Magnesium Bisglycinate (£10–15) — glycinate form is the most bioavailable and gentlest on digestion.',
            }] : []),
            {
              name: 'Whey Protein',
              emoji: '🥛',
              dose: '1–2 scoops (~25–50g protein)',
              timing: 'Post-workout or whenever you\'re behind on protein',
              why: `Your target is ${plan.protein}g protein daily. If you're consistently hitting it through food, skip this. But on busy days or post-gym when you need a quick hit, whey is the most efficient and cost-effective protein source.`,
              product: 'MyProtein Impact Whey or Bulk Pure Whey Protein — both £20–30 for a month\'s supply.',
            },
          ].map(sup => (
            <div key={sup.name} className="border border-gray-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{sup.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{sup.name}</p>
                  <p className="text-xs text-emerald-600">{sup.dose} · {sup.timing}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">{sup.why}</p>
              <p className="text-xs text-gray-400">💡 <em>{sup.product}</em></p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <div className="no-print flex gap-3 justify-center pb-4">
        <button
          onClick={() => window.print()}
          className="bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-700 transition-colors"
        >
          Export as PDF
        </button>
        <button
          onClick={onRestart}
          className="bg-white border border-emerald-200 text-emerald-700 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-50 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  )
}
