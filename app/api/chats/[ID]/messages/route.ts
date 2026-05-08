import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = getUserIdFromRequest(request);

        if (!userId) {
            return NextResponse.json(
                { error: "tidak dikenal, login dulu" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json(
                { error: "message gaboleh kosong" },
                { status: 400 }
            );
        }

        const chat = await prisma.chat.findUnique({
            where: { id: params.id },
        });

        if (!chat || chat.userId !== userId) {
            return NextResponse.json(
                { error: "chat not found" },
                { status: 404}
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { children: true },
        });

        await prisma.message.create({
            data: {
                content,
                role: "user",
                chatId: params.id,
            },
        });

        const history = await prisma.message.findMany({
            where: { chatId: params.id },
            orderBy: { createdAt: "asc" },
        });

        const aiResponse = await callGemini(content, history, user)

        const aiMessage = await prisma.message.create({
            data: {
                content: aiResponse,
                role: "assistant",
                chatId: params.id,
            },
        });

        return NextResponse.json({
            message: aiMessage,
        })

    } catch (error) {
        return NextResponse.json(
            { errpr: "internal server error" },
            { status: 500 }
        );
    }
}

async function callGemini (content: string, history: any[], user: any) {
    const child = user?.children?.[0];
    const aiStyle = user?.aiStyle || "Emphatic";

    const styleGuide = {
        Casual: "prompt buat casual ai nya",
        Empathetic: "prompt buat empathetic ai nya",
        Precise: "prompt buat precise ai nya",
    };

    const systemPrompt = ``;

    // format chat history buat gemini ny
    const formattedHistory = history.slice(0, -1).map((msg) => ({
        role: msg.role == "user" ? "user" : "model",
        parts: [{ text: msg.content }],
    }));

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemPrompt }],
                },
                contents: [...formattedHistory, { role: "user", parts: [{ text: content }] }],
            }),
        }
    );
    
    const data = await response.json()
    return data.candidates[0].content.parts[0].text

}