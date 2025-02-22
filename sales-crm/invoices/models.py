from django.db import models
from leads.models import Customer  # Updated import to use Customer from leads app
from employee.models import Employee

class Invoice(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=50, unique=True)
    created_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[
            ('DRAFT', 'Draft'),
            ('SENT', 'Sent'),
            ('PAID', 'Paid'),
            ('OVERDUE', 'Overdue'),
        ],
        default='DRAFT'
    )
    created_by = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_invoices'
    )

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.customer.company_name}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    @property
    def total(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f"{self.description} - {self.invoice.invoice_number}"
