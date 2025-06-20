from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .services.parser import extract_text_from_pdf
from .services.openai_client import call_openai


def build_prompt(category: str, content: str) -> str:
    """Return a prompt based on the given category and content."""
    prompts = {
        "mangelanzeige": (
            f"Du bist Baujurist. Erstelle eine Mangelanzeige nach VOB/B \u00a74(7) auf Basis dieses Berichts:\n\n{content}"
        ),
        "nachtrag": (
            f"Formuliere einen Nachtrag gem\u00e4\u00df VOB auf Grundlage dieser Angaben:\n\n{content}"
        ),
        "bautagebuch": (
            f"Erstelle einen formellen Bautagebucheintrag basierend auf folgenden Informationen:\n\n{content}"
        ),
        "vob_pruefen": (
            f"Pr\u00fcfe, ob folgender Sachverhalt einen Mangel gem\u00e4\u00df VOB/B darstellt:\n\n{content}"
        ),
        "email_korrektur": (
            f"Formuliere aus folgendem Rohtext eine professionelle E-Mail:\n\n{content}"
        ),
    }
    return prompts.get(category, f"Verarbeite diesen Text:\n\n{content}")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Optional später: ["http://localhost:5173", "http://45.89.125.188:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    category: str = Form(...),
):
    text = await extract_text_from_pdf(file)

    if not text.strip():
        raise HTTPException(status_code=422, detail="Leerer PDF-Text")

    if not category:
        category = "mangelanzeige"

    valid_categories = {
        "mangelanzeige",
        "nachtrag",
        "bautagebuch",
        "vob_pruefen",
        "email_korrektur",
    }

    if category not in valid_categories:
        raise HTTPException(status_code=400, detail="Ungültige Kategorie")

    prompt = build_prompt(category, text)
    generated_text = call_openai(prompt)

    return JSONResponse(
        {
            "text": text,
            "generated": generated_text,
        }
    )


@app.post("/prompt")
async def prompt(message: str = Form(...), category: str = Form("")):
    if not message.strip():
        raise HTTPException(status_code=422, detail="Leere Eingabe")

    if not category:
        category = "frei"

    valid_categories = {
        "mangelanzeige",
        "nachtrag",
        "bautagebuch",
        "vob_pruefen",
        "email_korrektur",
        "frei",
    }

    if category not in valid_categories:
        raise HTTPException(status_code=400, detail="Ungültige Kategorie")

    prompt = build_prompt(category, message)
    gpt_answer = call_openai(prompt)

    return JSONResponse(
        {
            "input": message,
            "generated": gpt_answer,
        }
    )
