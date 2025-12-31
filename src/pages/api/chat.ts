import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  runtime: 'edge',
};

export default async function POST(req: Request) {
  try {
    // TMP DEBUG: Log environment variables to the server console
    console.log("VITE_GEMINI_API_KEY:", import.meta.env.VITE_GEMINI_API_KEY);

    const { message } = await req.json();

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: {
            message:'API key not found. Please set the VITE_GEMINI_API_KEY environment variable.',
          },
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!message) {
      return new Response(
        JSON.stringify({
          error: {
            message: 'Message is required.',
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: "Hello, you are an expert assistant for the G-PLAN application. Your goal is to help users understand and use the app's features. The app tracks assignments, habits, expenses, study sessions, moods, and goals. Keep your answers concise and helpful." }],
        },
        {
          role: 'model',
          parts: [{ text: "Hello! I am the G-PLAN assistant. How can I help you today?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 150,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'An unexpected error occurred.',
        },
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
