INSTALLED_APPS = [
    # ...existing apps...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...other middleware...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js development server
]
