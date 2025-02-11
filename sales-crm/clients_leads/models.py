from django.db import models
from django.core.validators import MinValueValidator

class ContactType(models.TextChoices):
    LEAD = 'LEAD', 'Lead'
    CLIENT = 'CLIENT', 'Client'

class CompanyInfo(models.Model):
    company_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    employee_count = models.PositiveIntegerField(null=True, blank=True)
    budget_estimate = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    country = models.CharField(max_length=100)
    company_needs = models.TextField()
    description = models.TextField()
    contact_type = models.CharField(
        max_length=10,
        choices=ContactType.choices,
        default=ContactType.LEAD
    )
    # Score only applies to leads, null for clients
    expected_score = models.FloatField(
        null=True, 
        blank=True,
        help_text="Score is only applicable for leads"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Company Information"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.company_name} ({self.get_contact_type_display()})"

    def save(self, *args, **kwargs):
        # Clear expected_score if company is a client
        if self.contact_type == ContactType.CLIENT:
            self.expected_score = None
        super().save(*args, **kwargs)
