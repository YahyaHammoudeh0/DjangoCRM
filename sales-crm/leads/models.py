from django.db import models

class BaseContact(models.Model):
    company_name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        abstract = True  # This makes it an abstract base class

class Lead(BaseContact):
    source = models.CharField(max_length=255, blank=True, null=True)  # e.g., "Website", "Referral"
    status = models.CharField(
        max_length=50,
        choices=[("New", "New"), ("Contacted", "Contacted"), ("Qualified", "Qualified"), ("Unqualified", "Unqualified")],
        default="New"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    score = models.FloatField(default=0.0)
    industry = models.CharField(max_length=255, blank=True, null=True)
    employee_count = models.IntegerField(null=True, blank=True)
    budget_estimate = models.FloatField(null=True, blank=True)
    country = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.status})"

class Customer(BaseContact):
    address = models.TextField(blank=True, null=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
