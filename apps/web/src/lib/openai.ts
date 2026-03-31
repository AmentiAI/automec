import OpenAI from 'openai'
import type { FitmentResult } from '@automec/types'

const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] })

export async function explainFitmentResult(
  partName: string,
  vehicleDescription: string,
  result: FitmentResult,
): Promise<string> {
  const prompt = `
You are a knowledgeable automotive performance specialist. Explain this fitment result in plain English for a car enthusiast.

Part: ${partName}
Vehicle: ${vehicleDescription}
Fitment status: ${result.status}
Notes: ${result.notes ?? 'None'}
Conditions: ${result.conditions.join(', ') || 'None'}
Required supporting parts: ${result.requiredParts.map((p) => p.name).join(', ') || 'None'}
Conflicting parts: ${result.conflictingParts.map((p) => p.name).join(', ') || 'None'}
Tune required: ${result.tuneRequired ? 'Yes' : 'No'}
Compatible tune platforms: ${result.tunePlatforms.join(', ') || 'N/A'}

Write 2-3 sentences. Be direct. Do not start with "Sure" or "Of course".
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
    temperature: 0.3,
  })

  return response.choices[0]?.message.content ?? ''
}

export async function generatePartDescription(
  partName: string,
  brand: string,
  category: string,
  attributes: Record<string, string>,
): Promise<string> {
  const attrText = Object.entries(attributes)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ')

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: `Write a concise product description (2-3 sentences) for this automotive performance part. Be factual and enthusiast-focused. No fluff.\n\nPart: ${partName}\nBrand: ${brand}\nCategory: ${category}\nAttributes: ${attrText}`,
      },
    ],
    max_tokens: 150,
    temperature: 0.4,
  })

  return response.choices[0]?.message.content ?? ''
}
