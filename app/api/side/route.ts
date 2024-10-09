import { NextResponse } from "next/server";

const message = "Error! Contact support.";

export async function GET(req: Request) {
    const allowedOrigins = ['https://rustbet.com', 'https://murderflip.com', 'http://localhost:3000'];
    const origin = req.headers.get('Origin');

    const response = new NextResponse(JSON.stringify({ message }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Set CORS headers if the origin is allowed
    if (allowedOrigins.includes(origin || '')) {
        response.headers.set("Access-Control-Allow-Origin", origin || '');
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Credentials", "true");
    }

    return response;
}
