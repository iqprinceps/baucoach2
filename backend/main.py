from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse

from .services.parser import extract_text_from_pdf

app = FastAPI()


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    text = await extract_text_from_pdf(file)
    return JSONResponse({"text": text})
