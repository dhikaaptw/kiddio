import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: "No access, login dulu bang"},
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, ageYears, ageMonths, aiStyle } = body;

        const child = await prisma.child.findUnique({
            where: { id },
        });

        if (!child || child.userId !== userId) {
            return NextResponse.json(
                { error: "Child not found" },
                { status: 404 }
            );
        }

        const updated = await prisma.child.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(ageYears !== undefined && { ageYears }),
                ...(ageMonths !== undefined && { ageMonths }),
            },
        });

        return NextResponse.json({
            message: "Profile Child berhasil diupdate bang",
            child: updated, 
        });

    } catch (error) {
        console.error("Error updating child:", error);
        return NextResponse.json(
            { error: "Failed to update child" },
            { status: 500 }
        );
    }
}