#!/bin/bash
set -e

python3 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

if [ ! -f .env ]; then
    cp .env.example .env
fi

alembic upgrade head
echo "Setup complete. Run \"source .venv/bin/activate\" to activate the virtual environment."
