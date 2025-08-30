interface OllamaConfig {
	url: string;
	model: string;
}

interface GeminiConfig {
	apikey: string;
	model: string;
}

interface BackendConfig {
	ollama: OllamaConfig;
	gemini: GeminiConfig;
}

interface PluginConfig {
	active: "ollama" | "gemini";
	backend: BackendConfig;
}

interface OllamaResponse {
	response: string;
}

interface GeminiResponse {
	candidates?: Array<{
		content?: {
			parts?: Array<{
				text?: string;
			}>;
		};
	}>;
}

interface TransformResult {
	code: string;
	map: null;
}

function buildPrompt(userPrompt: string): string {
	return `You are a CSS/Tailwind generator.
Your task is to return only valid Tailwind CSS classes in JSON format.
RULES:
- Output must be valid JSON.
- The JSON must have one key: "classes".
- The value of "classes" must be a single string containing all Tailwind CSS classes.
- Do not include explanations, markdown, code blocks, or any extra text.
- Always aim for a modern, elegant and responsive design.
- Avoid overly repetitive or conflicting classes.
EXAMPLE:
USER PROMPT: "główny kontener, pełna wysokość ekranu, tło gradient niebieski do fioletowego, wycentrowana zawartość"
EXPECTED OUTPUT:
{"classes": "min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600"}
Now generate for this prompt:
USER PROMPT: ${userPrompt}`;
}

// różne backendy
async function generateWithOllama(
	prompt: string,
	{ url, model }: OllamaConfig,
): Promise<string> {
	const res = await fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			model,
			prompt,
			stream: false,
		}),
	});
	const data: OllamaResponse = await res.json();
	return data.response.trim().replace(/\s+/g, " ") || "";
}

async function generateWithGemini(
	prompt: string,
	{ apikey, model }: GeminiConfig,
): Promise<string> {
	const res = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apikey}`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }] }],
			}),
		},
	);
	const data: GeminiResponse = await res.json();
	return (
		data?.candidates?.[0]?.content?.parts?.[0]?.text
			?.trim()
			.replace(/\s+/g, " ") || ""
	);
}

// main plugin
export default function AiCssPlugin(config: PluginConfig) {
	return {
		name: "ai-css-transform",
		async transform(
			code: string,
			id: string,
		): Promise<TransformResult | undefined> {
			if (!id.endsWith(".jsx") && !id.endsWith(".tsx")) return;

			const regex = /aiCss\(\s*["`]([\s\S]*?)["`]\s*\)?/g;
			let match: RegExpExecArray | null;
			let newCode = code;

			while ((match = regex.exec(code)) !== null) {
				const userPrompt = match[1].trim();
				const fullPrompt = buildPrompt(userPrompt);
				const cssRegex = /\{["']classes["']\s*:\s*["'][^"']*["']\}/;
				let css = "";

				if (config.active === "ollama") {
					css = await generateWithOllama(fullPrompt, config.backend.ollama);
					const cssMatch = css.match(cssRegex);
					if (cssMatch) {
						css = JSON.parse(cssMatch[0]).classes;
					}
				} else if (config.active === "gemini") {
					css = await generateWithGemini(fullPrompt, config.backend.gemini);
					const cssMatch = css.match(cssRegex);
					if (cssMatch) {
						css = JSON.parse(cssMatch[0]).classes;
					}
				}

				newCode = newCode.replace(match[0], `"${css}"`);
			}

			return { code: newCode, map: null };
		},
	};
}
