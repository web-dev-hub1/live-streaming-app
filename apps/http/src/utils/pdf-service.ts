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
    let stdoutData = ""
    let timeout:NodeJS.Timeout
    timeout = setTimeout(() => {
      cleanup();
      reject("Process timed out");
    }, 30000);
    const cleanup = () => {
      clearTimeout(timeout);
      process.kill();
    };
    process.stdin.write(pdfBuffer);
    process.stdin.end();
    process.stdout.on("data", (data) => {
      stdoutData += data.toString();
    });

    process.stderr.on("data", (errorData) => {
      errors.push(errorData.toString());
    });
    process.on("close", (code) => {
      cleanup();
      if (code === 0) {
        try {
          resolve(JSON.parse(stdoutData));
        } catch (error) {
          reject(`JSON Parse Error: ${error}`);
        }
      } else {
        reject(`Process exited with code ${code}: ${errors.join(", ")}`);
      }
    });
    process.on("error", (err) => {
      cleanup();
      reject(`Process failed to start: ${err.message}`);
    });
  });
};
