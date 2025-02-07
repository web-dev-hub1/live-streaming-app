import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { sessionSchema } from "@repo/shared-schema/sharedSchema";
import { prisma } from "@repo/db/client";
import { generateSessionId } from "../../../lib/utils";
import { verifyRoleMiddleware } from "../../../middleware/verifyRoleMiddleware";
import { Request } from "express";

export const sesssionRouter: Router = Router();

sesssionRouter.post("/", authMiddleware, verifyRoleMiddleware(["ADMIN"]), async (req: Request, res) => {
    const sessionData = sessionSchema.safeParse(req.body);
    if(!sessionData.success) {
        res.status(400).json({"error": "Invalid input"});
        return
    }
    try {
        const sessionId = generateSessionId();
        const creatorId = req.userDetails?.id as string;
        const startDate = new Date(sessionData.data.startTime);
        const endDate = new Date(sessionData.data.endTime);
        const currentDate = new Date();
        if (startDate >= endDate && startDate < currentDate) {
            res.status(400).json({
                "message": "Incorrect Date and Time"
            })
            return
        }
        const stream = await prisma.streams.create({
            data: {
                streamID: sessionId,
                streamTitle: sessionData.data.title,
                description: sessionData.data.description,
                startTime: startDate,
                endTime: endDate,
                creatorId: creatorId,
                thumbnail: sessionData.data.thumbnail ?? "https://cat.png",   //dummy link
                slides: sessionData.data.slides ?? undefined,
            }
        })
        res.status(200).json({ stream });
    } catch (error) {
        res.status(500).json({"error": error})
        return
    }
})

sesssionRouter.put("/:sessionId/start", authMiddleware,  verifyRoleMiddleware(["ADMIN"]), async (req: Request, res) => {
    const sessionId = req.params.sessionId;
    const creatorId = req.userDetails?.id as string;
    try {
        await prisma.streams.update({
            where: {
                creatorId,
                streamID: sessionId
            },
            data: {
                status: 'RUNNING'
            }
        })
        return
    } catch(error) {
        res.status(400).json({
            "message": "Invalid session ID"
        })
        return
    }
})

sesssionRouter.put("/:sessionId/end", authMiddleware, verifyRoleMiddleware(["ADMIN"]),async (req: Request, res) => {
    const sessionId = req.params.sessionId;
    const creatorId = req.userDetails?.id as string;
    try {
        await prisma.streams.update({
            where: {
                creatorId,
                streamID: sessionId
            },
            data: {
                status: 'COMPLETED',
                videoLink: 'https://cat.png'    //dummy link
            }
        })
        return
    } catch(error) {
        res.status(400).json({
            "message": "Invalid session ID"
        })
        return
    }
})