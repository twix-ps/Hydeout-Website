import { NextResponse } from "next/server";

const message = "Error! Contact ihyd support.";

export async function GET(req: Request) {
    return NextResponse.json({ error: message }, { status: 200 });
}
