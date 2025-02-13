from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Lead, Customer
from .serializers import LeadSerializer, CustomerSerializer, LeadToCustomerSerializer

@api_view(['GET', 'POST'])
def manage_customers(request):
    if request.method == 'POST':
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    customers = Customer.objects.all()
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def convert_lead_to_customer(request):
    serializer = LeadToCustomerSerializer(data=request.data)
    if serializer.is_valid():
        customer = serializer.save()
        return Response(CustomerSerializer(customer).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
