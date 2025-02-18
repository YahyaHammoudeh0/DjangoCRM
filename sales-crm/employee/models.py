from django.contrib.auth.models import AbstractUser
from django.db import models

class Employee(AbstractUser):
    department = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.username} - {self.department}"

    class Meta:
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'