import OpenAI from "openai";

/**
 * Handles POST /api/ai/suggest
 * Expects JSON body: { origin, destination, distanceKm, rideType, fares }
 * Returns { suggestion: string }
 */

let openai;
function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "YOUR_OPENAI_API_KEY_HERE") {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

export async function getAiSuggestion(req, res) {
  try {
    const { origin, destination, distanceKm, rideType, fares } = req.body;
    if (!origin || !destination || !distanceKm || !fares) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const client = getOpenAIClient();
    if (!client) {
      return res.json({ suggestion: "AI suggestion unavailable - OpenAI API key not configured." });
    }

    // Build a concise description of the fare data
    const fareLines = Object.entries(fares)
      .map(([provider, data]) => `${provider}: ₹${data.total}`)
      .join("\n");

    const prompt = `You are an assistant that helps a user decide which rideshare provider to take.
User wants to travel from ${origin} to ${destination}, distance ${distanceKm} km, ride type ${rideType || "car"}.
Here are the estimated fares:
${fareLines}
Provide a friendly, concise recommendation (max 2 sentences) telling the user which provider is cheapest and which is fastest (if known), and any tips. Use a casual tone.`;

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });
    const suggestion = completion.choices[0].message.content.trim();
    res.json({ suggestion });
  } catch (err) {
    console.error("AI suggestion error:", err);
    res.status(500).json({ error: "Failed to generate suggestion" });
  }
}
