from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny  # added import
from .models import Settings

class SettingsAPIView(APIView):
    permission_classes = [AllowAny]  # allow public access to settings
    
    def get(self, request):
        settings_obj, _ = Settings.objects.get_or_create(pk=1, defaults={
            'colors': {
                "primary": "#4f46e5",
                "secondary": "#f59e0b",
                "accent": "#10b981",
                "background": "#ffffff",
                "text": "#111827"
            }
        })
        data = {
            "logo": settings_obj.logo,
            "colors": settings_obj.colors
        }
        return Response(data, status=status.HTTP_200_OK)
    
    def put(self, request):
        settings_obj, _ = Settings.objects.get_or_create(pk=1)
        # Only update logo if a non-empty value is provided, otherwise preserve existing logo
        if "logo" in request.data and request.data["logo"]:
            settings_obj.logo = request.data["logo"]
        # Always update colors
        settings_obj.colors = request.data.get("colors", settings_obj.colors)
        settings_obj.save()
        data = {
            "logo": settings_obj.logo,
            "colors": settings_obj.colors
        }
        return Response(data, status=status.HTTP_200_OK)
