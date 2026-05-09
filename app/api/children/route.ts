import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: "No access, login dulu bang"},
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, ageYears, ageMonths, aiStyle } = body;

        if (!name || ageYears === undefined || ageMonths === undefined) {
            return NextResponse.json(
                { error: "Nama & umur diisi dulu bg"},
                { status: 400 }
            );
        }

        const child = await prisma.child.create({
            data: {
                name,
                ageYears: Number(ageYears), 
                ageMonths: Number(ageMonths),
                userId,
            },
        });

        if (aiStyle) {
            await prisma.user.update({
                where: { id: userId },
                data: { aiStyle },
            });
        }

        return NextResponse.json({
            message: "Profile Child berhasil dibuat bang",
            child,
        })
    
    } catch (error) {
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 },
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const userId = getUserIdFromRequest(request);
        
        if (!userId) {
            return NextResponse.json(
                { error: "No access, login dulu bang"},
                { status: 401 }
            );
        }

        const children = await prisma.child.findMany({
            where: { userId },
        });

        return NextResponse.json({ children });
    
    } catch (error) {
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 },
        );
    }
}