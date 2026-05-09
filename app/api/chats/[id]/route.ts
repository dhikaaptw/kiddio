import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; 
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: "tidak dikenal, login dulu" },
                { status: 401 }
            );
        }

        const chat = await prisma.chat.findUnique({
            where: { id: id },
        });

        if (!chat || chat.userId !== userId) {
            return NextResponse.json(
                { error: "chat not found" },
                { status: 401 }
            );
        }

        await prisma.message.deleteMany({
            where: { chatId: id },
        });
        
        await prisma.chat.delete({
            where: { id: id },
        });
        
        return NextResponse.json({ message: "chat has been deleted" });
        
    } catch (error) {
        return NextResponse.json(
            { error: "terjadi kesalahan server" },
            { status : 500 }
        );
    }
}
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: "tidak dikenal, login dulu" },
                { status: 401 }
            );
        }

        const chat = await prisma.chat.findUnique({
            where: { id },
        });

        if (!chat || chat.userId !== userId) {
            return NextResponse.json(
                { error: "chat not found" },
                { status: 404 }
            );
        }

        const messages = await prisma.message.findMany({
            where: { chatId: id },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json({ messages });

    } catch (error) {
        return NextResponse.json(
            { error: "terjadi kesalahan server" },
            { status: 500 }
        );
    }
}