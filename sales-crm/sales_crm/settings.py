import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(override=True)  # Add override=True to ensure environment variables are updated

# ...existing code...

INSTALLED_APPS = [
    # ...existing apps...
    'corsheaders',
    'leads',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at the top
    # ...existing middleware...
]

CORS_ALLOW_ALL_ORIGINS = True  # Only use this in development!
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Comment out or remove the CORS_ALLOWED_ORIGINS setting if you're using CORS_ALLOW_ALL_ORIGINS
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
# ]

# ...rest of existing code...
