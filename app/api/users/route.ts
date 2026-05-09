import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: "tidak dikenal, login dulu" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { children: true },
        });

        if (!user) {
            return NextResponse.json(
                { error: "user not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ 
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                aiStyle: user.aiStyle,
                children: user.children,
            }
         });

    } catch (error) {
        return NextResponse.json(
            { error: "terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: "tidak dikenal, login dulu" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, aiStyle } = body;

        const user = await prisma.user.update({
            where: { id: userId },
            data: { 
                ...(name && { name }),
                ...(aiStyle && { aiStyle }),
            },
        });

        return NextResponse.json({
            message: "profil sudah diperbarui",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                aiStyle: user.aiStyle,
            }
        });

    } catch (error) {
        return NextResponse.json(
            { error: "terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: "tidak dikenal, login dulu" },
                { status: 401 }
            );
        }
        
        await prisma.message.deleteMany({
            where: { chat: { userId } },
        });
        await prisma.chat.deleteMany({ where: { userId } });
        await prisma.child.deleteMany({ where: { userId } });
        await prisma.user.delete({ where: { id: userId } });

        return NextResponse.json({ message: "akun berhasil dihapus" });

    } catch (error) {
        return NextResponse.json(
            { error: "terjadi kesalahan server" },
            { status: 500 }
        );
    }
}