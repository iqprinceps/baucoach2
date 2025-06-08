# Baucoach Backend

## Setup

1. Create a `.env` file in the project root based on `.env.example`:

```
cp .env.example .env
# then edit .env and add your OpenAI API key
```

2. Install the required packages:

```
pip install fastapi uvicorn pdfplumber python-dotenv openai
```

## Running the Backend

Start the FastAPI server using Uvicorn:

```
uvicorn backend.main:app --reload
```
