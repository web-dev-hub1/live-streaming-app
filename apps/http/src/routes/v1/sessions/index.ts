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
        res.status(400).json({"erro": "Invalid input"});
        return
    }
    try {
        const sessionId = generateSessionId();
        res.status(200).json({ sessionId });
        const creatorId = req.userDetails?.id as string;
        const stream = await prisma.streams.create({
            data: {
                streamID: sessionId,
                streamTitle: sessionData.data.title,
                description: sessionData.data.description,
                startTime:  sessionData.data.startTime,
                endTime: sessionData.data.endTime,
                creatorId: creatorId,
                thumbnail: sessionData.data.thumbnail,
                slides: sessionData.data.slides,
            }
        })
    } catch (error) {
        res.status(500).json({"error": error})
        return
    }
})

sesssionRouter.put("/:sessionId/start", authMiddleware,  verifyRoleMiddleware(["ADMIN"]), async (req: Request, res) => {
    const sessionId = req.params.sessionId;
    //Only the Session creator or co-creator can start or end the session.
    try {
        await prisma.streams.update({
            where: {
                streamID: sessionId
            },
            data: {
                status: 'RUNNING'
            }
        })
    } catch(error) {

    }
})

sesssionRouter.put("/:sessionId/end", authMiddleware, async (req, res) => {
    const sessionId = req.params.sessionId;
    //Only the Session creator or co-creator can start or end the session.
    try {
        await prisma.streams.update({
            where: {
                streamID: sessionId
            },
            data: {
                status: 'COMPLETED'
            }
        })
    } catch(error) {
        
    }
})