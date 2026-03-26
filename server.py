"""
Flower federated averaging server (not the HTTP API).
Saves global_federated_model.h5 when training finishes.
"""

import flwr as fl
from model import create_cnn_model

strategy = fl.server.strategy.FedAvg(
    min_fit_clients=2,
    min_available_clients=2,
    min_evaluate_clients=2,
    fraction_fit=1.0,
    fraction_evaluate=1.0,
    on_fit_config_fn=None,
)

fl.server.start_server(
    server_address="localhost:8080",
    config=fl.server.ServerConfig(num_rounds=100),
    strategy=strategy,
)

print("Training complete. Saving global model...")
model = create_cnn_model()
weights = strategy.initial_parameters
if weights is not None:
    model.set_weights(fl.common.parameters_to_ndarrays(weights))
model.save("global_federated_model.h5")
print("Saved global_federated_model.h5")
