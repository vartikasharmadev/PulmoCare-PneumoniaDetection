import io
import os
import sys
import warnings
from contextlib import asynccontextmanager

warnings.filterwarnings(
    "ignore",
    message=r".*urllib3 v2 only supports OpenSSL.*",
    category=Warning,
)

print(
    "Loading TensorFlow + SciPy (first time can take 1–3 minutes). Do not interrupt.\n"
    "Use fl_env (Python 3.9), not .venv.\n",
    file=sys.stderr,
    flush=True,
)

try:
    from tensorflow.keras.models import load_model
    from tensorflow.keras.preprocessing import image
except ImportError:
    print(
        f"TensorFlow missing or unsupported on Python {sys.version_info.major}.{sys.version_info.minor}.\n"
        "Use: cd backend && source ../fl_env/bin/activate && python main.py\n",
        file=sys.stderr,
    )
    raise SystemExit(1) from None

import numpy as np
import uvicorn
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

model = None


def load_trained_model() -> None:
    global model
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    model_path = os.path.join(repo_root, "global_federated_model.h5")
    if os.path.exists(model_path):
        print(f"Loading weights from {model_path}...", flush=True)
        model = load_model(model_path)
        print("Model ready.", flush=True)
    else:
        print(f"No model file at {model_path}", flush=True)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    load_trained_model()
    yield


app = FastAPI(title="Pneumonia Detection API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Pneumonia Detection API is running"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> dict:
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img = img.resize((150, 150))
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction_val = model.predict(img_array, verbose=0)[0][0]

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
        ) from e


if __name__ == "__main__":
    use_reload = os.environ.get("UVICORN_RELOAD", "").strip() == "1"
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=use_reload,
    )
