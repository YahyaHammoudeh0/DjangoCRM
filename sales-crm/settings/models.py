from django.db import models

class Settings(models.Model):
    logo = models.URLField(blank=True, null=True)
    colors = models.JSONField(default=dict)  # requires Django 3.1+

    def __str__(self):
        return "Site Settings"
