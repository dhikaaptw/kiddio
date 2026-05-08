import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: "tidak dikenal, login dulu" },
                { status: 401 }
            );
        }

        // validate requested user
        const chat = await prisma.chat.findUnique({
            where: { id: params.id },
        });

        if (!chat || chat.userId !== userId) {
            return NextResponse.json(
                { error: "chat not found" },
                { status: 401 }
            );
        }

        await prisma.message.deleteMany({
            where: { chatId: params.id },
        });
        
        await prisma.message.delete({
        where: { id: params.id },
        });
        
        return NextResponse.json({ message: "message has been deleted" });
        
    } catch (error) {
        return NextResponse.json(
            { error: "terjadi kesalahan server" },
            { status : 500 }
        );
    }
}