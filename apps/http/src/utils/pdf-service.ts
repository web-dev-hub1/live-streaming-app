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
    let output = "";
    let error = "";
    process.stdin.write(pdfBuffer);
    process.stdin.end();
    process.stdout.on("data", (data) => {
      output += data.toString();
    });
    process.stderr.on("data", (data) => {
      error += data.toString();
    });
    process.on("close", (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result.images);
        } catch (parseError) {
          reject(`JSON Parse Error: ${parseError}`);
        }
      } else {
        reject(`Error: ${error}`);
      }
    });
  });
};
