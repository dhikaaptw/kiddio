import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { decode } from "punycode";

export function getUserIdFromRequest(request: NextRequest): string | null {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        const token = authHeader.substring(7);

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        return decoded.userId
    
    } catch (error) {
        return null;
    }
}