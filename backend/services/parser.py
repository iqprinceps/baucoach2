import io

import pdfplumber
from fastapi import UploadFile


async def extract_text_from_pdf(file: UploadFile) -> str:
    """Extract text from all pages of an uploaded PDF file."""
    file_bytes = await file.read()
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        pages_text = [page.extract_text() or "" for page in pdf.pages]
    return "\n".join(pages_text)
