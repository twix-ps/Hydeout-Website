import { NextResponse } from "next/server";

const message = "Rustbet is down effective immediately, for more information join this server: https://discord.gg/TtkWDVMt8r and wait for an announcement!";

export async function GET(req: Request) {
    return NextResponse.json({ error: message }, { status: 201 });
}
