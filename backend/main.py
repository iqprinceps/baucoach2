from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse

from .services.parser import extract_text_from_pdf
from .services.openai_client import call_openai

app = FastAPI()


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    text = await extract_text_from_pdf(file)

    if not text.strip():
        raise HTTPException(status_code=422, detail="Leerer PDF-Text")

    prompt = f"""
    Du bist ein erfahrener Baujurist. Erstelle eine rechtssichere Mangelanzeige nach VOB/B §4(7), basierend auf folgendem Baustellenbericht:

    {text}

    Die Anzeige soll klar, juristisch korrekt und formal sein.
    """

    generated_text = call_openai(prompt)

    return JSONResponse({
        "text": text,
        "generated": generated_text
    })
