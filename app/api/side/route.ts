import { NextResponse } from "next/server";

const message = "Error! Contact support.";

export async function GET(req: Request) {
    return new NextResponse(JSON.stringify({ message }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    })
}