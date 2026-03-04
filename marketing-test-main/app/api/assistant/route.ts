import { NextResponse } from 'next/server';
import { schoolData } from '@/data/school-data';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            console.error('GOOGLE_API_KEY is missing from environment variables');
            return NextResponse.json({ error: 'Google API Key is not configured' }, { status: 500 });
        }

        const systemInstruction = `You are the Edmento AI Assistant, an intelligent assistant for a school principal.
Your role is to help the principal analyze school data, performance trends, syllabus insights, and other metrics based on the provided data context.
Always be professional, concise, and helpful. Do not make up any data that is not present in the context. Answer based solely on the provided context.

Here is the current school data context:
${JSON.stringify(schoolData, null, 2)}
`;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
        });

        // Map messages to Gemini format (role must be 'user' or 'model')
        const contents = messages.map((m: any) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content || '' }],
        }));

        const result = await model.generateContent({ contents });
        const responseText = result.response.text();

        return NextResponse.json({ reply: responseText });

    } catch (error) {
        console.error('API Error in /api/assistant:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
