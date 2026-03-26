"""Evaluate global_federated_model.h5 on data/test (run from project root)."""

from pathlib import Path

from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
ROOT = Path(__file__).resolve().parent
model = load_model(ROOT / "global_federated_model.h5")

datagen = ImageDataGenerator(rescale=1.0 / 255)
test_gen = datagen.flow_from_directory(
    str(ROOT / "data" / "test"),
    target_size=(150, 150),
    batch_size=32,
    class_mode="binary",
    shuffle=False,
)

loss, acc = model.evaluate(test_gen)
print(f"\nTest accuracy: {acc * 100:.2f}%")
print(f"Test loss: {loss:.4f}")

predictions = (model.predict(test_gen) > 0.5).astype("int32")
y_true = test_gen.classes
y_pred = predictions.flatten()

print("\nClassification report:")
print(classification_report(y_true, y_pred, target_names=["NORMAL", "PNEUMONIA"]))

print("\nConfusion matrix:")
print(confusion_matrix(y_true, y_pred))

auc = roc_auc_score(y_true, y_pred)
print(f"\nROC-AUC: {auc:.4f}")
