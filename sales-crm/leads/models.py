from django.db import models

class Lead(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    source = models.CharField(max_length=255, blank=True, null=True)  # e.g., "Website", "Referral"
    status = models.CharField(
        max_length=50,
        choices=[("New", "New"), ("Contacted", "Contacted"), ("Qualified", "Qualified"), ("Unqualified", "Unqualified")],
        default="New"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.status})"

class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    # ✅ Link to the original Lead (optional tracking)
    lead = models.OneToOneField(Lead, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name
