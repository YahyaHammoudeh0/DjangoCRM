from rest_framework import serializers
from .models import Invoice

class InvoiceSerializer(serializers.ModelSerializer):
    client_name = serializers.ReadOnlyField(source='client.name')  # Display customer name instead of ID

    class Meta:
        model = Invoice
        fields = ['id', 'invoice_number', 'client', 'amount', 'status', 'due_date']
