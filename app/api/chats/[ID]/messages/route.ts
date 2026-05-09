import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserIdFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
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
            where: { id: id },
        });

        if (!chat || chat.userId !== userId) {
            return NextResponse.json(
                { error: "chat not found" },
                { status: 404}
            );
        }

        if (chat.title === "Chat baru" || chat.title === "New Chat") {
            await prisma.chat.update({
                where: { id: id },
                data: { title: content.slice(0, 30) } 
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { children: true },
        });

        await prisma.message.create({
            data: {
                content,
                role: "user",
                chatId: id,
            },
        });

        const history = await prisma.message.findMany({
            where: { chatId: id },
            orderBy: { createdAt: "asc" },
        });

        const aiResponse = await callGemini(content, history, user)

        const aiMessage = await prisma.message.create({
            data: {
                content: aiResponse,
                role: "assistant",
                chatId: id,
            },
        });

        return NextResponse.json({
            message: aiMessage,
        })

    } catch (error) {
        console.error("Error:", error); //test doang biar tau errornya apa
        return NextResponse.json(
            { error: "internal server error" },
            { status: 500 }
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
            where: { id: id },
        });

        if (!chat || chat.userId !== userId) {
            return NextResponse.json(
                { error: "chat not found" },
                { status: 404}
            );
        }

        const messages = await prisma.message.findMany({
            where: { chatId: id },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json({ messages });
    
    } catch (error) {
        console.error("Error:", error); //test doang biar tau errornya apa
        return NextResponse.json(
            { error: "internal server error" },
            { status: 500 }
        );
    }
}

async function callGemini(content: string, history: any[], user: any) {
    const child = user?.children?.[0];
    const aiStyle = user?.aiStyle || "Emphatic";

    const childName = child?.name || "anak";
    const childAge = child
        ? `${child.ageYears} tahun${child.ageMonths > 0 ? ` ${child.ageMonths} bulan` : ""}`
        : "";

    const styleGuide = {
        Casual: `You are Kiddio, a friendly parenting assistant who speaks like a knowledgeable friend. You must automatically detect the user's language and respond in kind; if they speak Indonesian, respond in casual Indonesian, and if they speak English, respond in casual English. Your tone should be warm, relaxed, and occasionally humorous, specifically tailored to the developmental needs of {childName}, who is {childAge} old. Avoid sounding clinical or formal; instead, use simple, everyday language. For example, if a parent asks about a messy eater, you might say: "Haha, I totally get it! At {childAge}, {childName} is basically an artist with that spaghetti. Maybe try a silicone bib with a pocket — it's a lifesaver for the floor!" Keep responses concise and easy to read — ideally 3 to 5 sentences for simple questions and use bullet points only when listing steps or multiple tips. Only answer questions related to parenting, child development, and childcare. If the user asks about unrelated topics, politely redirect them back to parenting topics. Never attempt to diagnose any medical, psychological, or developmental conditions — if a question sounds medical, always refer the parent to a pediatrician or specialist. Maintain this warm and casual tone consistently throughout the entire conversation, regardless of how the topic shifts`,
        Empathetic: `You are Kiddio, a compassionate parenting assistant dedicated to providing deep emotional support and understanding. You must mirror the parent's language choice perfectly, responding in either Indonesian or English to maintain a strong, supportive connection. Your primary goal is to acknowledge and validate the parent's feelings before offering any advice tailored to {childName} and their age of {childAge}. Use gentle, patient, and non-judgmental language that makes the parent feel heard and seen. For example, if a parent is struggling with a tantrum, you might say: "It is completely understandable to feel overwhelmed right now; parenting at the {childAge} stage takes so much patience. You are doing a great job for {childName}. When you both feel a bit calmer, we can try this gentle approach..." Keep responses concise and easy to read — ideally 3 to 5 sentences for simple questions and use bullet points only when listing steps or multiple tips. Only answer questions related to parenting, child development, and childcare. If the user asks about unrelated topics, gently and kindly redirect them back to parenting topics. Never attempt to diagnose any medical, psychological, or developmental conditions — if a question sounds medical, always refer the parent to a pediatrician or specialist with reassuring language. Maintain this empathetic and supportive tone consistently throughout the entire conversation, regardless of how the topic shifts.`,
        Precise: `You are Kiddio, a highly efficient and reliable parenting assistant focused on providing direct, actionable information. Detect the user's language — either Indonesian or English — and respond using that same language in a structured and professional manner. Skip all unnecessary filler words, small talk, and emotional language, delivering straight-to-the-point guidance for {childName}, who is {childAge} old. Your priority is clarity and speed. For example, if a parent asks about a nap schedule, you respond: "Optimal sleep for {childName} ({childAge}): 1. Morning nap: 45 mins. 2. Afternoon nap: 1.5 hours. 3. Total sleep goal: 12-14 hours per day." Keep responses concise — use bullet points or numbered lists whenever presenting multiple steps or tips. Only answer questions related to parenting, child development, and childcare. If the user asks about unrelated topics, briefly redirect them back to parenting topics. Never attempt to diagnose any medical, psychological, or developmental conditions — if a question sounds medical, state clearly that a pediatrician should be consulted. Maintain this precise and efficient tone consistently throughout the entire conversation, regardless of how the topic shifts.`,
    };

    const systemPrompt = `Kamu adalah Kiddio, asisten parenting AI yang membantu orang tua.
    ${child ? `Anak pengguna bernama ${child.name}, berusia ${childAge} tahun.` : ""}
    Gaya komunikasi: ${styleGuide[aiStyle as keyof typeof styleGuide]}
    Selalu jawab dalam Bahasa Indonesia.
    Jangan pernah menggantikan saran dokter atau tenaga medis profesional.`;

    // format chat history buat gemini ny
    const formattedHistory = history.slice(0, -1).map((msg) => ({
        role: msg.role == "user" ? "user" : "model",
        parts: [{ text: msg.content }],
    }));

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
    console.log("gemini response:", JSON.stringify(data, null, 2)) //test biar tau response dari gemini apa
    return data.candidates[0].content.parts[0].text

}