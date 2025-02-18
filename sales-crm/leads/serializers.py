from rest_framework import serializers
from .models import Lead, Customer
from employee.serializers import EmployeeSerializer

class LeadSerializer(serializers.ModelSerializer):
    assigned_to = EmployeeSerializer(read_only=True)
    
    class Meta:
        model = Lead
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class LeadToCustomerSerializer(serializers.Serializer):
    lead_id = serializers.IntegerField()

    def create(self, validated_data):
        lead_id = validated_data.get("lead_id")
        lead = Lead.objects.get(id=lead_id)

        # Convert lead to customer using correct field names
        customer = Customer.objects.create(
            company_name=lead.company_name,
            email=lead.email,
            phone=lead.phone,
            industry=lead.industry,
            country=lead.country,
            converted_from_lead=lead,  # Track original lead
            contact_person=""  # Add a default value
        )

        # Optional: Update lead status
        lead.status = "Qualified"
        lead.save()

        return customer
