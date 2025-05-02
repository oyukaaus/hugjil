import { DEFAULT_OPENAI_MODEL } from "@/shared/Constants";
import { OpenAIModel } from "@/types/Model";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body;
  const messages = (body?.messages || []) as ChatCompletionRequestMessage[];
  const model = (body?.model || DEFAULT_OPENAI_MODEL) as OpenAIModel;

  const promptMessage: ChatCompletionRequestMessage = {
    role: "system",
    content: "You are ChatGPT. Respond to the user like you normally would.",
  };

  const initialMessages = messages.splice(0, 3);
  const latestMessages = messages.slice(-5);

  const fullMessages = [promptMessage, ...initialMessages, ...latestMessages];

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const completion = await openai.createChatCompletion({
        model: model.id,
        temperature: 0.5,
        messages: fullMessages,
      });

      const responseMessage = completion.data.choices[0].message?.content?.trim();

      if (!responseMessage) {
        return res.status(400).json({
          error: "Unable to get a response from OpenAI. Please try again.",
        });
      }

      return res.status(200).json({ message: responseMessage });
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 429 && attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        const waitTime = 1000 * attempt;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      console.error("OpenAI API Error:", error?.response?.data || error.message);

      return res.status(status || 500).json({
        error:
          error?.response?.data?.error?.message ||
          "An error occurred while communicating with OpenAI.",
      });
    }
  }

  return res.status(429).json({
    error: "Too many requests. Please slow down and try again.",
  });
}
