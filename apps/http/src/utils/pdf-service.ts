import { spawn } from "child_process";
import path from "path";
export const convertPdfToImages = (
  pdfBuffer: Buffer,
  outputFolder: string
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(
      __dirname,
      "../../../../packages/pdf2Image/src/convert.py"
    );
    const process = spawn("python", [scriptPath, outputFolder]);
    let errors:string[] = [];
    process.stdin.write(pdfBuffer);
    process.stdin.end();
    process.stdout.on("data", (data) => {
      try {
        const imagePaths:string[] = JSON.parse(data.toString())
        resolve(imagePaths)
      } catch (error) {
        reject(`JSON Parse Error: ${error}`)
      }
    });
    process.stderr.on("data", (errorData) => {
      errors.push(errorData.toString());
    });
    process.on("close", (code) => {
      if (code !== 0) {
        reject(`Error: ${errors.join(", ")}`);
      }
    });
  });
};
