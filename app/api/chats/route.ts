import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: "tidak dikenal, login dulu"},
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title } = body;

        const chat = await prisma.chat.create({
            data: {
                title: title || "Chat baru",
                userId,
            },
        });

        return NextResponse.json({
            message: "chat sudah dibuat",
            chat,
        });

    } catch (error) {
        return NextResponse.json(
            { error: "terjadi kesalahan server"},
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const userId = getUserIdFromRequest(request);
        
        if (!userId) {
            return NextResponse.json(
                { error: "tidak dikenal, login dulu"},
                { status: 401 }
            );
        }

        const chats = await prisma.chat.findMany({
            where: {userId},
            orderBy: { createdAt: "desc" }, //chat yg terbaru
        });

        return NextResponse.json({ chats });

    } catch (error) {
        return NextResponse.json(
            { error: "terjadi kesalahan server" },
            { status: 500 }
        );
    }
}