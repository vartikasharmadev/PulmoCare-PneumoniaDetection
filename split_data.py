import os
import shutil
import random

# ✅ Path to your Kaggle dataset
base_dir = "chest-xray-pneumonia/train"

# ✅ Define your clients (simulated hospitals)
clients = ["client1", "client2", "client3"]

# ✅ Make folders for each client (NORMAL and PNEUMONIA)
for client in clients:
    os.makedirs(f"data/{client}/NORMAL", exist_ok=True)
    os.makedirs(f"data/{client}/PNEUMONIA", exist_ok=True)

# ✅ Get all image filenames
normal_imgs = os.listdir(f"{base_dir}/NORMAL")
pneumonia_imgs = os.listdir(f"{base_dir}/PNEUMONIA")

# Shuffle so distribution is random
random.shuffle(normal_imgs)
random.shuffle(pneumonia_imgs)

# ✅ Split equally between 3 clients
split_n = len(normal_imgs) // len(clients)
split_p = len(pneumonia_imgs) // len(clients)

for i, client in enumerate(clients):
    start_n, end_n = i * split_n, (i + 1) * split_n
    start_p, end_p = i * split_p, (i + 1) * split_p

    for img in normal_imgs[start_n:end_n]:
        shutil.copy(f"{base_dir}/NORMAL/{img}", f"data/{client}/NORMAL/")
    for img in pneumonia_imgs[start_p:end_p]:
        shutil.copy(f"{base_dir}/PNEUMONIA/{img}", f"data/{client}/PNEUMONIA/")

print("✅ Data successfully divided into client folders!")
