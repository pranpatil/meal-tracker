import type { FormData, NutritionPlan, GeminiPlan } from './types'

const GATEWAY = 'https://gemini-gateway-494395912091.asia-south1.run.app'

export async function generatePlan(formData: FormData, plan: NutritionPlan): Promise<GeminiPlan> {
  const { stats, lifestyle, food, snacks } = formData

  const prompt = `You are a professional nutritionist. Generate a personalized nutrition plan as JSON.

User profile:
- Age: ${stats.age}, Sex: ${stats.sex}
- Current weight: ${stats.weightKg}kg, Goal weight: ${stats.goalWeight}kg
- Job type: ${lifestyle.jobType}, Exercise: ${lifestyle.exercisePerWeek}x/week (${lifestyle.exerciseType || 'general'})
- Sleep: ${lifestyle.sleepHours}h/night, Stress: ${lifestyle.stressLevel}
- Alcohol: ${lifestyle.drinksAlcohol === 'yes' ? `${lifestyle.alcoholUnitsPerWeek} units/week` : 'none'}
- Favourite meals: ${food.favoriteMeals || 'no preference'}
- Hated foods: ${food.hatedFoods || 'none'}
- Dietary restrictions: ${food.restrictions || 'none'}
- Cooking style: ${food.cookingStyle}
- Current snacks: ${snacks.currentSnacks || 'none'}, trigger: ${snacks.snackTrigger}, preference: ${snacks.snackPreference}
- Late night snacking: ${snacks.lateNightSnacking}

Calculated targets:
- Daily calories: ${plan.targetCalories} kcal (${plan.tdee} kcal maintenance minus 500 kcal deficit)
- Protein: ${plan.protein}g, Carbs: ${plan.carbs}g, Fat: ${plan.fat}g

Rules:
- Do NOT include beef in any meal
- Respect all dietary restrictions listed above
- Avoid hated foods
- Meal calories should roughly add up to the daily target

Return ONLY a valid JSON object with no markdown, no explanation, exactly this structure:
{
  "mealPlan": [
    {
      "day": "Monday",
      "theme": "short theme name",
      "meals": [
        { "type": "Breakfast", "name": "meal name", "calories": 400, "protein": 30, "carbs": 40, "fat": 10 },
        { "type": "Lunch", "name": "meal name", "calories": 500, "protein": 35, "carbs": 50, "fat": 15 },
        { "type": "Dinner", "name": "meal name", "calories": 600, "protein": 40, "carbs": 55, "fat": 18 },
        { "type": "Snack", "name": "snack name", "calories": 150, "protein": 10, "carbs": 15, "fat": 5, "note": "optional tip" }
      ]
    }
  ],
  "snackSwaps": [
    { "original": "current snack (~X kcal)", "swap": "healthier alternative", "calories": "Y kcal" }
  ],
  "rules": [
    "Rule 1 text",
    "Rule 2 text",
    "Rule 3 text",
    "Rule 4 text",
    "Rule 5 text"
  ],
  "supplements": [
    { "name": "Supplement name", "dose": "dose", "timing": "when to take", "note": "brief reason" }
  ]
}

Provide exactly 7 days, 5-7 snack swaps, exactly 5 rules tailored to the user's profile, and 3-5 supplements.`

  const res = await fetch(`${GATEWAY}/gemini/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })

  if (!res.ok) throw new Error(`Gateway error: ${res.status}`)

  const data = await res.json()
  const text = typeof data === 'string' ? data : (data.text ?? data.response ?? data.content ?? JSON.stringify(data))
  return JSON.parse(text) as GeminiPlan
}
