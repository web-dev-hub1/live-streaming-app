import { sessionIdSchema, signinSchema, signupSchema, slidesPdfSchema } from "@repo/shared-schema/sharedSchema";
import { prisma } from "@repo/db/client";
import { Request, Router } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { supRouter } from "./super_admin";
import { authMiddleware } from "../../middleware/authMiddleware";
import multer from "multer";
import ImageKit from "imagekit";
import { convertPdfToImages } from "../../utils/pdf-service";
import path from "path";
import fs from 'fs';
const upload = multer();
dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});
export const router: Router = Router();

router.post("/signup", async (req, res) => {
  const signupData = signupSchema.safeParse(req.body);
  if (!signupData.success) {
    res.status(400).json({ error: "Invalid input data" });
    return;
  }
  try {
    const userWithEmail = await prisma.user.findUnique({
      where: {
        email: signupData.data.email,
      },
    });
    if (userWithEmail) {
      res.status(409).json({ error: "Email already exists" });
      return;
    }
    const userWithId = await prisma.user.findUnique({
      where: {
        userName: signupData.data.userName,
      },
    });
    if (userWithId) {
      res.status(409).json({ error: "User ID already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(signupData.data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: signupData.data.email,
        userName: signupData.data.userName,
        password: hashedPassword,
        role: "USER",
      },
    });
    res.status(201).json({
      message: "User created successfully",
      userName: newUser.userName,
      email: newUser.email,
      role: newUser.role,
    });
    console.log(newUser);
  } catch (error) {
    res.status(500).json({ "internal error": error });
  }
});
router.post("/signin", async (req, res) => {
  const signinData = signinSchema.safeParse(req.body);
  if (!signinData.success) {
    res.status(400).json({ error: "Invalid input data" });
    return;
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: signinData.data.email,
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const isMatch = await bcrypt.compare(
      signinData.data.password,
      user.password
    );
    if (!isMatch) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const jwtToken = jwt.sign(
      { email: user.email, userName: user.userName, role: user.role },
      (process.env.JWT_SECRET as string) || "default_secret"
    );
    res.cookie("jwt", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Signin successful" });
  } catch (error) {
    res.status(500).json({ error: error });
    return;
  }
});
router.post(
  "/session/slides/pdf",
  upload.single("pdf"),
  authMiddleware,
  async (req: Request, res) => {
    const sessionValidation = sessionIdSchema.safeParse({ sessionId: req.params.sessionId });
    if (!sessionValidation.success) {
      res.status(400).json({ message: "Invalid session ID format" });
      return
    }
    const sessionId = sessionValidation.data.sessionId

    if (!req.file) {
      res.status(400).json({ message: "No PDF file provided" });
      return;
    }
    const pdfValidation = slidesPdfSchema.safeParse({pdf:req.file});
    if(!pdfValidation.success){
      res.status(400).json({message:pdfValidation.error.message})
      return
    }
    
    const findUser = await prisma.user.findUnique({
      where: {
        email: req.user?.email,
      },
    });
    if (!findUser) {
      res.status(400).json({ message: "User not found!" });
      return;
    }
    const UserCreatorOrcohost = await prisma.stream.findFirst({
      where: {
        OR: [
          { creatorId: findUser?.id },
          { coHosts: { some: { id: findUser?.id } } },
        ],
        id: sessionId,
      },
    });

    if (!UserCreatorOrcohost) {
      res
        .status(403)
        .json({ message: "User is not authorized to access this session" });
      return;
    }
    const pdfBuffer = req.file?.buffer;
    const decomposeAndUploadPDF = async (pdfBuffer: Buffer) => {
      try {
        const outputFolder = path.resolve(__dirname, "../../output-images/");
        console.log("Output folder path:", outputFolder);
        const images = await convertPdfToImages(pdfBuffer, outputFolder);

        let imageKitUrls:any = []
        const files = await fs.promises.readdir(outputFolder);
          const imageFiles = files.filter(file => file.endsWith(".png"));
          for(const file of imageFiles){
            const imagePath = path.join(outputFolder,file)
            try {
              const fileBuffer = fs.readFileSync(imagePath)
              const response = await imagekit.upload({
                file:fileBuffer,
                fileName:file,
                folder:'/pdf-images'
              })
              imageKitUrls.push({
                type:"image",
                payload:{
                  imageUrl:response.url
                }
              })
              console.log(`✅ Uploaded ${file}:`, response.url)
            } catch (error) {
              console.log(`❌ Error uploading ${file}:`, error)
            }
          }
        return imageKitUrls
      } catch (error:any) {
        throw error
      }
    };
    try {
      const slides: any = await decomposeAndUploadPDF(pdfBuffer as Buffer);
      res.status(200).json({ message: "PDF added successfully", slides });
      const outputFolder = path.resolve(__dirname, "../../output-images/");
      await fs.promises.rm(outputFolder, { recursive: true, force: true });
      console.log(`🗑️ Removed output folder: ${outputFolder}`);
      return;
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
      return;
    }
  }
);

router.use("/sup", supRouter);
