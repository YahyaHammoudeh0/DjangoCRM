from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Employee

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

class EmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = Employee
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name',
                 'department', 'position', 'phone', 'salary', 'is_active')
        extra_kwargs = {
            'password': {'write_only': True},
            'is_active': {'default': True},
            'username': {'required': True},
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def create(self, validated_data):
        try:
            print("Validated data:", {
                **validated_data,
                'password': '[REDACTED]'
            })
            # Use create_user to properly hash password
            password = validated_data.pop('password')
            employee = Employee.objects.create_user(
                **validated_data
            )
            employee.set_password(password)
            employee.save()
            return employee
        except Exception as e:
            print(f"Error in EmployeeSerializer.create: {str(e)}")
            raise serializers.ValidationError(str(e))

class LoginResponseSerializer(serializers.Serializer):
    token = serializers.CharField()
    is_superuser = serializers.BooleanField(source='user.is_superuser')
    username = serializers.CharField()