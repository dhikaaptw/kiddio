import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { message: "login dl"},
                { status: 400 },
            );
        }

        const body = await request.json();
        const { title } = body;

        const chat = await prisma.chat.create({
            data: {
                title: title || "Chat Baru",
                userId,
            },
        });

        //test
        return NextResponse.json(
            {
                message: "chat has been loaded",
                chat: {
                    id: chat.id,
                    name: chat.title,
                }
            }
        )

    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error"},
            { status: 400 },
        );
    }
}