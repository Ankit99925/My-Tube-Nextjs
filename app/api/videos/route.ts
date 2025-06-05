import { NextRequest, NextResponse } from "next/server";
import { withAccelerate } from "@prisma/extension-accelerate"
import { PrismaClient } from "@/app/generated/prisma"

const prisma = new PrismaClient().$extends(withAccelerate())

export async function GET(request: NextRequest) {

    try {
        const videos = await prisma.video.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        return NextResponse.json(videos)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}