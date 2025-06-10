# Baucoach Backend

## Setup

Helper scripts are provided for setting up PostgreSQL (optional) and preparing the
Python environment. Make sure the scripts are executable:

```bash
chmod +x setup_postgres.sh setup.sh
```

### 1. (Optional) Install and configure PostgreSQL

Run the following if PostgreSQL is not yet installed on your system:

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
exist).

## Running the Backend

Start the FastAPI server using Uvicorn:

```bash
uvicorn backend.main:app --reload
```
