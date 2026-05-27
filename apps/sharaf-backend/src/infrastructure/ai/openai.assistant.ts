import { injectable, inject } from "inversify";
import type OpenAI from "openai";
import { TYPES } from "@mahama/backend-core";
import type { BackendEnv } from "@mahama/config";
import type { AiAssistant } from "../../domain/ports.js";

@injectable()
export class OpenAiAssistant implements AiAssistant {
  constructor(
    @inject(TYPES.OpenAI) private readonly openai: OpenAI | null,
    @inject(TYPES.Config) private readonly env: BackendEnv,
  ) {}

  private async chat(system: string, user: string): Promise<string> {
    if (!this.openai) return "AI is currently unavailable.";
    const response = await this.openai.chat.completions.create({
      model: this.env.OPENAI_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.6,
      max_tokens: 700,
    });
    return response.choices[0]?.message?.content?.trim() ?? "";
  }

  async ask(question: string, context: string): Promise<string> {
    const system =
      "You are a careful, factual research assistant for the official portfolio of a public Ghanaian figure. " +
      "Answer ONLY using the provided context. If the answer is not present, say you don't have that information. " +
      "Keep answers concise (max 4 sentences) and respectful.";
    return this.chat(system, `Context:\n${context}\n\nQuestion: ${question}`);
  }

  async draftBio(notes: string, subject: string): Promise<string> {
    const system =
      "You are a senior speechwriter and biographer. Write in dignified, plain English. " +
      "Avoid hyperbole. Honour the subject's privacy. Output ~250 words.";
    return this.chat(system, `Subject: ${subject}\n\nNotes:\n${notes}\n\nWrite a polished biography.`);
  }

  async polish(text: string, tone: string): Promise<string> {
    const system = `You are an expert editor. Rewrite the user's text in a ${tone} tone. Preserve all facts. Return only the polished text.`;
    return this.chat(system, text);
  }

  async summarize(text: string): Promise<string> {
    const system = "Summarize the following text in 2-3 short sentences. Preserve all proper nouns.";
    return this.chat(system, text);
  }
}
