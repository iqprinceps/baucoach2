#!/bin/bash
set -e

source .venv/bin/activate
uvicorn backend.main:app

