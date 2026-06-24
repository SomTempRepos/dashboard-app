import os
import threading

from tinydb import TinyDB

from config import DATA_DIR

os.makedirs(DATA_DIR, exist_ok=True)

# TinyDB's default JSON storage is not safe for concurrent reads/writes.
# A request that writes (e.g. creating a task) while another request reads
# the same file can corrupt it down to 0 bytes, which then crashes every
# subsequent read with a JSONDecodeError. This lock serializes all access
# to all four tables so two requests never touch a file at the same time.
db_lock = threading.Lock()

users_db = TinyDB(os.path.join(DATA_DIR, "users.json"))
tasks_db = TinyDB(os.path.join(DATA_DIR, "tasks.json"))
teams_db = TinyDB(os.path.join(DATA_DIR, "teams.json"))
comments_db = TinyDB(os.path.join(DATA_DIR, "comments.json"))
