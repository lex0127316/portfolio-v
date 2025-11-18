import { config as loadEnv } from "dotenv";
import OpenAI from "openai";

loadEnv({ path: ".env.local" });
loadEnv();

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = (() => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
})();

interface ImageGenerationOptions {
  prompt: string;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
}

export async function generateImage(options: ImageGenerationOptions): Promise<{ url: string } | null> {
  try {
    if (!openai) {
      console.warn("OpenAI API key not configured - skipping image generation");
      return null;
    }
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: options.prompt,
      n: 1,
      size: options.size || "1024x1024",
      quality: options.quality || "standard",
    });
    const firstImage = response.data?.[0];
    return firstImage?.url ? { url: firstImage.url } : null;
  } catch (error: any) {
    console.error("OpenAI image generation failed:", error.message);
    // Return null instead of throwing - graceful degradation
    return null;
  }
}

export function createProjectPrompt(
  title: string,
  tags: string[],
  palette: string[],
  deviceFrame: string
): string {
  const techStack = tags.slice(0, 3).join(", ");
  const colors = palette.slice(0, 2).join(" and ");
  
  return `High-quality professional mockup of a ${title} interface displayed on a ${deviceFrame} device frame. The UI should be modern, clean, and minimalist with ${colors} color scheme. Show a ${techStack} application with sleek design, proper spacing, and Swiss design aesthetic. Photorealistic device mockup, soft lighting, professional presentation.`;
}

export function createHeroBackgroundPrompt(): string {
  return "Abstract minimal geometric pattern with soft gradients, muted neutral tones, Swiss design aesthetic. Subtle shapes, clean lines, generous white space, contemporary and sophisticated. Low contrast, peaceful, professional background texture.";
}

export function createPDFCoverPrompt(name: string, role: string): string {
  return `Minimal professional resume cover page design with geometric abstract shapes. Text: "${name}" and "${role}". Clean typography, Swiss minimalism, muted color palette, elegant composition, high-end design, subtle gradients, generous white space.`;
}
