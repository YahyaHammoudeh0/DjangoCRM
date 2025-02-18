from django.db import models
from employee.models import Employee

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
    assigned_to = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_leads'
    )

    def __str__(self):
        return f"{self.name} ({self.status})"

class Customer(BaseContact):
    address = models.TextField(blank=True, null=True)
    industry = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=255, blank=True, null=True)  # Add country field
    contact_person = models.CharField(max_length=255, blank=True, null=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    converted_from_lead = models.OneToOneField(
        Lead,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='converted_customer'
    )

    def __str__(self):
        return self.company_name or ''
