import io
import os
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import tflite_runtime.interpreter as tflite

print("🚀 Starting TFLite Pneumonia Detection API...")

# -------------------------
# LOAD MODEL
# -------------------------
model_path = os.path.join(os.path.dirname(__file__), "model.tflite")

if not os.path.exists(model_path):
    raise RuntimeError(f"❌ model.tflite not found at {model_path}")

interpreter = tflite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

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
def root():
    return {"message": "Pneumonia Detection API running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        img = Image.open(io.BytesIO(contents)).convert("RGB")
        img = img.resize((150, 150))

        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0).astype("float32")

        interpreter.set_tensor(input_details[0]['index'], img_array)
        interpreter.invoke()

        prediction_val = interpreter.get_tensor(output_details[0]['index'])[0][0]

        result = "PNEUMONIA" if prediction_val > 0.5 else "NORMAL"

        return {
            "prediction": result,
            "confidence": float(prediction_val),
        }

    except Exception as e:
        import traceback
        print("\n❌ ERROR DURING PREDICTION:")
        traceback.print_exc()

        raise HTTPException(status_code=500, detail=str(e))


# -------------------------
# RUN (RAILWAY COMPATIBLE)
# -------------------------