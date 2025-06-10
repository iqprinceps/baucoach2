# Baucoach Backend

## Setup

Helper scripts are provided for setting up PostgreSQL (optional) and preparing the
Python environment. Make sure the scripts are executable:

```bash
chmod +x setup_postgres.sh setup.sh run_backend.sh
```

### 1. (Optional) Install and configure PostgreSQL

Run the following if PostgreSQL is not yet installed on your system. The script
requires `sudo` privileges because it installs packages and modifies the system
configuration. When running in a containerized environment, you might need to
adjust the commands to fit your image or install PostgreSQL separately:

```bash
./setup_postgres.sh
```

This installs PostgreSQL and creates a `baucoach` database with the credentials
from `.env.example`.

### 2. Set up the Python environment

Execute the setup script to create the virtual environment, install
dependencies and apply database migrations:

```bash
./setup.sh
```

After it finishes, the script prints a reminder to activate the virtual environment. Activate it manually with:

```bash
source .venv/bin/activate
```

Customize `.env` as needed (the script copies `.env.example` if `.env` does not
exist). Before running the application, open `.env` and fill in your
`OPENAI_API_KEY` value.

## Running the Backend

Use the helper script to start the FastAPI server:

```bash
./run_backend.sh
```

The script activates `.venv` and launches `uvicorn backend.main:app`.

