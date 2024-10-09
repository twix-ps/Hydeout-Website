import { NextResponse } from "next/server";

const message = "Error! Contact support.";

export async function GET(req: Request) {
    return NextResponse.json({ error: message }, { status: 201 });
}
