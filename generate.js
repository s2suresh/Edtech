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

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let updatedCode = response.text.trim();
  updatedCode = updatedCode.replace(/^```html\s*/i, "").replace(/```$/i, "").trim();

  fs.writeFileSync("index.html", updatedCode);
  console.log("Successfully updated index.html");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
