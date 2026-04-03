

FROM python:3.9-slim

WORKDIR /app

# 🔥 FORCE CACHE BREAK
RUN echo "rebuild v2"

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Run app
CMD uvicorn main:app --host 0.0.0.0 --port 8080