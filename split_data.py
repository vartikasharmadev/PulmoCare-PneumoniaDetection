"""Split chest-xray-pneumonia/train into data/client{1,2,3}/ for federated clients."""

import os
import random
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
base_dir = ROOT / "chest-xray-pneumonia" / "train"
clients = ["client1", "client2", "client3"]

for client in clients:
    (ROOT / "data" / client / "NORMAL").mkdir(parents=True, exist_ok=True)
    (ROOT / "data" / client / "PNEUMONIA").mkdir(parents=True, exist_ok=True)

normal_imgs = os.listdir(base_dir / "NORMAL")
pneumonia_imgs = os.listdir(base_dir / "PNEUMONIA")
random.shuffle(normal_imgs)
random.shuffle(pneumonia_imgs)

split_n = len(normal_imgs) // len(clients)
split_p = len(pneumonia_imgs) // len(clients)

for i, client in enumerate(clients):
    start_n, end_n = i * split_n, (i + 1) * split_n
    start_p, end_p = i * split_p, (i + 1) * split_p

    for img in normal_imgs[start_n:end_n]:
        shutil.copy(
            base_dir / "NORMAL" / img,
            ROOT / "data" / client / "NORMAL" / img,
        )
    for img in pneumonia_imgs[start_p:end_p]:
        shutil.copy(
            base_dir / "PNEUMONIA" / img,
            ROOT / "data" / client / "PNEUMONIA" / img,
        )

print("Data split into data/client1, client2, client3.")
