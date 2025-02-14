import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(override=True)  # Add override=True to ensure environment variables are updated

# ...existing code...

INSTALLED_APPS = [
    # ...existing apps...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at the top
    # ...existing middleware...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# ...rest of existing code...
