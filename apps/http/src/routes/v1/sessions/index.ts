import { Router } from "express";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { sessionIdSchema, sessionSchema, slidesPdfSchema } from "@repo/shared-schema/sharedSchema";
import { prisma } from "@repo/db/client";
import { generateSessionId } from "../../../lib/utils";
import { verifyRoleMiddleware } from "../../../middleware/verifyRoleMiddleware";
import { Request } from "express";
import path from "path";
import { convertPdfToImages } from "../../../utils/pdf-service";
import ImageKit from "imagekit";
import multer from "multer";
import fs from 'fs'

const upload = multer();
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});
export const sesssionRouter: Router = Router();
sesssionRouter.post("/", authMiddleware, verifyRoleMiddleware(["ADMIN"]), async (req: Request, res) => {
    const sessionData = sessionSchema.safeParse(req.body);
    if(!sessionData.success) {
        res.status(400).json({"error": "Invalid input"});
        return
    }
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
    try {
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
        const updatedStream = await prisma.streams.updateMany({
            where: {
                creatorId,
                streamID: sessionId
            },
            data: {
                status: 'RUNNING'
            }
        })
        if(updatedStream.count === 0){
            res.status(404).json({message: "Invalid Session ID"})
        }
        return
    } catch(error) {
        res.status(500).json({
            error: 'An error occurred while updating the stream status',
            details: error
        });
        return
    }
})

sesssionRouter.put("/:sessionId/end", authMiddleware, verifyRoleMiddleware(["ADMIN"]),async (req: Request, res) => {
    const sessionId = req.params.sessionId;
    const creatorId = req.userDetails?.id as string;
    try {
        const updatedStream = await prisma.streams.updateMany({
            where: {
                creatorId,
                streamID: sessionId
            },
            data: {
                status: 'COMPLETED',
                videoLink: 'https://cat.png'    //dummy link
            }
        })
        if(updatedStream.count === 0){
            res.status(404).json({message: "Invalid Session ID"})
        }
        return
    } catch(error) {
        res.status(500).json({
            error: 'An error occurred while updating the stream status',
            details: error
        });
        return
    }
})
sesssionRouter.post(
    "/session/:sessionId/slides/pdf",
    upload.single("pdf"),
    authMiddleware,
    verifyRoleMiddleware(["ADMIN"]),
    async (req: Request, res) => {
      const sessionValidation = sessionIdSchema.safeParse({
        sessionId: req.params.sessionId,
      });
      if (!sessionValidation.success) {
        res.status(400).json({ message: "Invalid session ID format" });
        return;
      }
      const sessionId = sessionValidation.data.sessionId;
  
      if (!req.file) {
        res.status(400).json({ message: "No PDF file provided" });
        return;
      }
      const pdfValidation = slidesPdfSchema.safeParse({ pdf: req.file });
      if (!pdfValidation.success) {
        res.status(400).json({ message: pdfValidation.error.message });
        return;
      }
  
      const userCreatorOrcohost = await prisma.streams.findFirst({
        where: {
          OR: [
            { creatorId: req.userDetails?.id },
            { coHosts: { some: { id: req.userDetails?.id } } },
          ],
          id: sessionId,
        },
      });
  
      if (!userCreatorOrcohost) {
        res.status(403).json({ message: "User is not authorized to access this session" });
        return;
      }
      const pdfBuffer = req.file?.buffer;
      const decomposeAndUploadPDF = async (pdfBuffer: Buffer) => {
        try {
          const outputFolder = path.resolve(__dirname, "../../output-images/");
          const AllImagePaths = await convertPdfToImages(pdfBuffer, outputFolder);
          let imageKitUrls: any[] = []; 
          for (const imagePath of AllImagePaths) {
            try {
              const ImageBuffer = fs.readFileSync(imagePath);
              const response = await imagekit.upload({
                file: ImageBuffer,
                fileName: path.basename(imagePath),
                folder: "/pdf-images",
                
              });
              imageKitUrls.push({
                type: "image",
                payload: {
                  imageUrl: response.url,
                },
              });
              console.log(`✅ Uploaded ${imagePath}:`, response.url);
            } catch (error) {
              console.log(`❌ Error uploading ${imagePath}:`, error);
            }
          }
          return imageKitUrls;
        } catch (error: any) {
          throw error;
        }
      };
      try {
        const slides: any = await decomposeAndUploadPDF(pdfBuffer as Buffer);
        try {
          await prisma.streams.update({
            where: {
              id: sessionId,
            },
            data: {
              slides: slides,
            },
          });
          res.status(200).json({ message: "PDF added successfully", slides });
          return;
        } catch (error) {
          res.status(500).json({ message: "Internal Server Error", error });
          return;
        } finally {
          const outputFolder = path.resolve(__dirname, "../../output-images/");
          await fs.promises.rm(outputFolder, { recursive: true, force: true });
          console.log(`🗑️ Removed output folder: ${outputFolder}`);
        }
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
        return;
      }
    }
  );