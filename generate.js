const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing in GitHub Secrets.");
  }

  const ai = new GoogleGenAI({ apiKey });

  let existingCode = "";
  if (fs.existsSync("index.html")) {
    existingCode = fs.readFileSync("index.html", "utf8");
  }

  const prompt = `You are an expert frontend web developer for an Edtech platform.

Existing HTML Code:
${existingCode}

Requested Updates:
Title: ${process.env.ISSUE_TITLE}
Details: ${process.env.ISSUE_BODY}

Update index.html to incorporate these requested design changes, ensuring the layout is modern, visually appealing, responsive, and tailored for business advertising.
CRITICAL: Output ONLY valid raw HTML code. Do NOT wrap in \`\`\`html markdown blocks or include any introductory text.`;

  // List of active models to try in order of preference
  const modelsToTry = ["gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-2.5-pro"];
  let response = null;
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.log(`Attempting code generation with model: ${model}...`);
      response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });
      if (response && response.text) {
        console.log(`Successfully generated content using ${model}`);
        break;
      }
    } catch (err) {
      console.warn(`Model ${model} failed: ${err.message}. Trying next model...`);
      lastError = err;
    }
  }

  if (!response || !response.text) {
    throw lastError || new Error("Failed to generate code with available models.");
  }

  let updatedCode = response.text.trim();
  updatedCode = updatedCode.replace(/^```html\s*/i, "").replace(/```$/i, "").trim();

  fs.writeFileSync("index.html", updatedCode);
  console.log("Successfully updated index.html!");
}

run().catch((err) => {
  console.error("Error generating code:", err);
  process.exit(1);
});
