from rest_framework import serializers
from .models import Lead, Customer

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

# ✅ Serializer for Lead Conversion
class LeadToCustomerSerializer(serializers.Serializer):
    lead_id = serializers.IntegerField()

    def create(self, validated_data):
        lead_id = validated_data.get("lead_id")
        lead = Lead.objects.get(id=lead_id)

        # Convert lead to customer
        customer = Customer.objects.create(
            name=lead.name,
            email=lead.email,
            phone=lead.phone,
            lead=lead  # ✅ Track original lead
        )

        # Optional: Delete lead after conversion
        lead.delete()

        return customer
