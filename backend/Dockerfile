FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && pip uninstall -y torch torchvision torchaudio || true

# Copy app
COPY . .

# Run app
CMD uvicorn main:app --host 0.0.0.0 --port 8080