import flwr as fl
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from model import create_cnn_model
import sys

# Take client name as command-line argument
client_id = sys.argv[1] if len(sys.argv) > 1 else "client1"
data_dir = f"data/{client_id}"

# Image preprocessing
datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)
train = datagen.flow_from_directory(
    data_dir, target_size=(150,150), batch_size=32, subset='training',class_mode='binary'
)
val = datagen.flow_from_directory(
    data_dir, target_size=(150,150), batch_size=32, subset='validation',class_mode='binary'
)

# Build CNN
model = create_cnn_model()

# Define Flower client
class FlowerClient(fl.client.NumPyClient):
    def get_parameters(self, config):
        return model.get_weights()

    def fit(self, parameters, config):
        model.set_weights(parameters)
        model.fit(train, epochs=3, validation_data=val)
        return model.get_weights(), len(train), {}

    def evaluate(self, parameters, config):
        model.set_weights(parameters)
        loss, accuracy = model.evaluate(val)
        return loss, len(val), {"accuracy": float(accuracy)}

# Start client
fl.client.start_numpy_client(server_address="localhost:8080", client=FlowerClient())
