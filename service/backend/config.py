import os

SECRET_KEY = "your-secret-key-keep-it-safe"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
