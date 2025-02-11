from rest_framework import serializers
from .models import CompanyInfo

class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

    def validate_budget_estimate(self, value):
        if value < 0:
            raise serializers.ValidationError("Budget estimate cannot be negative")
        return value

    def validate_employee_count(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Employee count cannot be negative")
        return value
