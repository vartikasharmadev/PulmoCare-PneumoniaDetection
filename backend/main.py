import io
import os
import sys
import warnings

warnings.filterwarnings(
    "ignore",
    message=r".*urllib3 v2 only supports OpenSSL.*",
    category=Warning,
)

print("Starting Pneumonia Detection API...\n", file=sys.stderr, flush=True)

import numpy as np
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

# -------------------------
# GLOBAL MODEL
# -------------------------
model = None


def load_trained_model():
    global model

    # ✅ Lazy import (VERY IMPORTANT)
    from tensorflow.keras.models import load_model

    model_path = os.path.join(os.path.dirname(__file__), "global_federated_model.h5")

    if not os.path.exists(model_path):
        print(f"❌ Model file not found at {model_path}", flush=True)
        return

    print("🔄 Loading model (this may take time)...", flush=True)
    model = load_model(model_path)
    print("✅ Model loaded successfully", flush=True)


def get_model():
    global model
    if model is None:
        load_trained_model()
    return model


# -------------------------
# FASTAPI APP
# -------------------------
app = FastAPI(title="Pneumonia Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# ROUTES
# -------------------------
@app.get("/")
def read_root():
    return {"message": "Pneumonia Detection API is running"}


# ✅ REQUIRED FOR RAILWAY
@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # ✅ Lazy import (VERY IMPORTANT)
    from tensorflow.keras.preprocessing import image

    model_instance = get_model()

    if model_instance is None:
        raise HTTPException(status_code=500, detail="Model not available")

    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img = img.resize((150, 150))

        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction_val = model_instance.predict(img_array, verbose=0)[0][0]

        result = "PNEUMONIA" if prediction_val > 0.5 else "NORMAL"
        confidence = (
            float(prediction_val)
            if result == "PNEUMONIA"
            else float(1 - prediction_val)
        )

        return {
            "prediction": result,
            "confidence": confidence,
            "raw_value": float(prediction_val),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}",
        )


# -------------------------
# RUN (LOCAL ONLY)
# -------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )