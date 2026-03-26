# Save the final global model after training completes
import tensorflow as tf
from model import create_cnn_model

# Start Flower server
import flwr as fl

strategy = fl.server.strategy.FedAvg(
    min_fit_clients=2,
    min_available_clients=2,
    min_evaluate_clients=2,
    fraction_fit=1.0,
    fraction_evaluate=1.0,
    on_fit_config_fn=None,
)

history = fl.server.start_server(
    server_address="localhost:8080",
    config=fl.server.ServerConfig(num_rounds=100),
    strategy=strategy,
)

# After training rounds are done:
print("Training complete. Saving global model...")
model = create_cnn_model()
weights = strategy.initial_parameters
if weights is not None:
    model.set_weights(fl.common.parameters_to_ndarrays(weights))
model.save("global_federated_model.h5")
print("Global model saved as global_federated_model.h5")
