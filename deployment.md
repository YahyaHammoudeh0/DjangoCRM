# Deployment Steps

1. Configure Environment Variables:
   - Django (backend): Set SECRET_KEY, DEBUG, and DJANGO_CORS_ALLOWED_ORIGINS in your .env file.
   - Next.js (frontend): Set NEXT_PUBLIC_API_URL in your hosting environment.

2. Local Testing:
   - Verify that the Django API and Next.js app communicate correctly.
   - Check that CORS settings work as expected.

3. Deploy Backend:
   - Use a platform like Heroku, AWS, or DigitalOcean.
   - Configure your WSGI server (e.g., Gunicorn) and reverse proxy if needed.

4. Deploy Frontend:
   - Use a platform like Vercel or Netlify.
   - Ensure environment variables are properly set.

5. Post-deployment:
   - Test production endpoints.
   - Verify that CORS and API calls work securely and as expected.
