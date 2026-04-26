import { NextResponse } from "next/server";

let users: any[] = [];

export async function GET() {
    return NextResponse.json({ users });
}

export async function POST(req: Request) {
    const body = await req.json();

    const newUser = {
        id: Date.now(),
        email: body.email,
    };

    users.push(newUser);

    return NextResponse.json({
        message: "User Created",
        data: newUser,
    })
}