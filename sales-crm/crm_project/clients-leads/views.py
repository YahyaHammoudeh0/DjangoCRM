from django.shortcuts import render
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import CompanyInfo, ContactType
from .serializers import CompanyInfoSerializer
from django.core.exceptions import ValidationError
from rest_framework.decorators import action

class CompanyInfoViewSet(viewsets.ModelViewSet):
    queryset = CompanyInfo.objects.all()
    serializer_class = CompanyInfoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['contact_type', 'country', 'industry']
    search_fields = ['company_name', 'company_needs', 'description']
    ordering_fields = ['created_at', 'company_name', 'expected_score']

    def get_queryset(self):
        queryset = CompanyInfo.objects.all()
        contact_type = self.request.query_params.get('contact_type', None)
        if contact_type is not None:
            queryset = queryset.filter(contact_type=contact_type)
        return queryset

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def leads(self, request):
        leads = self.get_queryset().filter(contact_type=ContactType.LEAD)
        serializer = self.get_serializer(leads, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def clients(self, request):
        clients = self.get_queryset().filter(contact_type=ContactType.CLIENT)
        serializer = self.get_serializer(clients, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def convert_to_client(self, request, pk=None):
        company = self.get_object()
        if company.contact_type == ContactType.LEAD:
            company.contact_type = ContactType.CLIENT
            company.save()
        serializer = self.get_serializer(company)
        return Response(serializer.data)
