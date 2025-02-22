from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Invoice, InvoiceItem
from .serializers import InvoiceSerializer, InvoiceItemSerializer

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # The user is already an Employee instance
        serializer.save(created_by=self.request.user)

    def create(self, request, *args, **kwargs):
        # Extract items data if present
        items_data = request.data.pop('items', [])
        
        # Create invoice
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invoice = serializer.save(created_by=self.request.user)  # User is already an Employee

        # Create invoice items if any
        for item_data in items_data:
            item_data['invoice'] = invoice.id
            item_serializer = InvoiceItemSerializer(data=item_data)
            if item_serializer.is_valid():
                item_serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)