import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const studentData = await req.json();

        // Fix 2.1: Log exactly what we are sending
        console.log("--- SENDING TO FASTAPI ---");
        console.log(JSON.stringify(studentData, null, 2));

        // Forward this merged payload to the external AI service
        const response = await fetch(`${process.env.BACKEND_URL}/generate-remarks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
        });

        if (!response.ok) {
            console.error(`FastAPI returned status ${response.status}: ${response.statusText}`);
            const errorText = await response.text();
            console.error("FastAPI Error Body:", errorText);
            return NextResponse.json(
                { error: "Failed to generate narrative from ext API" },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Fix 2.3: Log the response body before sending it to client
        console.log("--- RECEIVED FROM FASTAPI ---");
        console.log(JSON.stringify(data, null, 2));

        return NextResponse.json(data);
    } catch (error) {
        // Fix 2.2: Comprehensive try-catch logging
        console.error("Generate Report API Fetch Error (Could not connect to FastAPI?):", error);
        return NextResponse.json(
            { error: "Failed to generate report" },
            { status: 500 }
        );
    }
}
