from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
import numpy as np

# Load saved model
model = load_model("global_federated_model.h5")

# Load test dataset
datagen = ImageDataGenerator(rescale=1./255)
test_gen = datagen.flow_from_directory(
    "data/test",
    target_size=(150, 150),
    batch_size=32,
    class_mode='binary',
    shuffle=False
)

# Evaluate model
loss, acc = model.evaluate(test_gen)
print(f"\nTest Accuracy: {acc*100:.2f}%")
print(f"Test Loss: {loss:.4f}")

# Predictions for metrics
predictions = (model.predict(test_gen) > 0.5).astype("int32")
y_true = test_gen.classes
y_pred = predictions.flatten()

# Classification report
print("\n📊 Classification Report:")
print(classification_report(y_true, y_pred, target_names=['NORMAL', 'PNEUMONIA']))

# Confusion matrix
print("\n🧾 Confusion Matrix:")
print(confusion_matrix(y_true, y_pred))

# ROC-AUC
auc = roc_auc_score(y_true, y_pred)
print(f"\n🚀 ROC-AUC Score: {auc:.4f}")
