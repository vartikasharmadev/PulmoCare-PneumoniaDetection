"""Flower client for federated learning (expects data/<client_id>/...)."""

import sys

import flwr as fl
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

from model import create_cnn_model

client_id = sys.argv[1] if len(sys.argv) > 1 else "client1"
data_dir = f"data/{client_id}"

datagen = ImageDataGenerator(rescale=1.0 / 255, validation_split=0.2)
train = datagen.flow_from_directory(
    data_dir,
    target_size=(150, 150),
    batch_size=32,
    subset="training",
    class_mode="binary",
)
val = datagen.flow_from_directory(
    data_dir,
    target_size=(150, 150),
    batch_size=32,
    subset="validation",
    class_mode="binary",
)

model = create_cnn_model()


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


fl.client.start_numpy_client(server_address="localhost:8080", client=FlowerClient())
