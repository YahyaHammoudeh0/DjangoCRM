from rest_framework import serializers
from .models import Invoice, InvoiceItem
from leads.serializers import CustomerSerializer

class InvoiceItemSerializer(serializers.ModelSerializer):
    total = serializers.DecimalField(read_only=True, max_digits=10, decimal_places=2)
    
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'unit_price', 'total']

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, required=False)
    customer_details = CustomerSerializer(source='customer', read_only=True)
    
    class Meta:
        model = Invoice
        fields = ['id', 'customer', 'customer_details', 'invoice_number', 'created_date', 
                 'due_date', 'total_amount', 'status', 'created_by', 'items']
