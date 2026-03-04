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

        const systemInstruction = `You are the Edmento AI Assistant, a highly intelligent and professional strategic advisor to a school principal.
Your role is to analyze school data, highlight critical trends, and provide actionable insights.

Follow these strict formatting guidelines to ensure a premium, "Gemini-like" experience:
1. **Structure**: Use clear headings (e.g., ### Overview, ### Key Insights) to organize information.
2. **Formatting**: Use **bold text** for emphasis, specific names, or critical numbers.
3. **Data Points**: When listing metrics or students, use bulleted or numbered lists for readability.
4. **Insightful Tone**: Don't just list data; provide brief context or "takeaways" (e.g., "This represents a 5% improvement since last term").
5. **Horizontal Spacing**: Use markdown tables if you need to compare multiple data points across subjects or classes.
6. **Conciseness**: Keep descriptions punchy but informative.

Answer based solely on the provided context. If data is missing, state it clearly.

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
