import fitz  # PyMuPDF
import os
import sys
import json
import uuid
from typing import List
from PIL import Image
def pdf_to_images(pdf_buffer: bytes, output_folder: str) -> List[str]:
    os.makedirs(output_folder, exist_ok=True)
    doc:fitz.Document = fitz.open(stream=pdf_buffer, filetype="pdf")
    total_pages = len(doc)
    
    output_paths = []
    
    for page_num in range(total_pages):
        try:
            page:fitz.Page = doc.load_page(page_num)
            matrix = fitz.Matrix(4,4)
            pix:fitz.Pixmap = page.get_pixmap(matrix=matrix,alpha=False)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            image_path = os.path.join(output_folder, f"image_{uuid.uuid4()}_{page_num + 1}.webp")
            img.save(image_path,'WEBP',loseless=True)
            output_paths.append(image_path)
        except Exception as e:
            print(f"Error converting page {page_num + 1}: {str(e)}", file=sys.stderr)
    doc.close()
    return output_paths

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python convert.py <script_path> <output_folder>"}))
        sys.exit(1)
    
    pdf_buffer = sys.stdin.buffer.read()
    output_folder = sys.argv[1]
    
    try:
        images = pdf_to_images(pdf_buffer, output_folder)
        print(json.dumps(images))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
