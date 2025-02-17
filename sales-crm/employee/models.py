from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class Employee(AbstractUser):
    department = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)

    groups = models.ManyToManyField(Group, related_name="employee_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="employee_permissions", blank=True)

    def __str__(self):
        return self.username