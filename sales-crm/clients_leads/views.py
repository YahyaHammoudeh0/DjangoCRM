from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render
from .models import CompanyInfo
from .serializers import CompanyInfoSerializer

def index(request):
    return render(request, 'clients_leads/index.html')

def leads_list(request):
    return render(request, 'clients_leads/leads_list.html')

def clients_list(request):
    return render(request, 'clients_leads/clients_list.html')

class CompanyInfoViewSet(viewsets.ModelViewSet):
    queryset = CompanyInfo.objects.all()
    serializer_class = CompanyInfoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['contact_type', 'industry', 'country']
    search_fields = ['company_name', 'description', 'company_needs']
    ordering_fields = ['created_at', 'expected_score', 'budget_estimate']

    def get_queryset(self):
        queryset = CompanyInfo.objects.all()
        min_score = self.request.query_params.get('min_score', None)
        max_score = self.request.query_params.get('max_score', None)
        
        if min_score is not None:
            queryset = queryset.filter(expected_score__gte=float(min_score))
        if max_score is not None:
            queryset = queryset.filter(expected_score__lte=float(max_score))
            
        return queryset

    @action(detail=False, methods=['get'])
    def leads(self, request):
        leads = self.get_queryset().filter(contact_type='LEAD')
        page = self.paginate_queryset(leads)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(leads, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def clients(self, request):
        clients = self.get_queryset().filter(contact_type='CLIENT')
        page = self.paginate_queryset(clients)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(clients, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        total_leads = CompanyInfo.objects.filter(contact_type='LEAD').count()
        total_clients = CompanyInfo.objects.filter(contact_type='CLIENT').count()
        avg_score = CompanyInfo.objects.filter(contact_type='LEAD').exclude(expected_score=None).aggregate(
            Avg('expected_score')
        )['expected_score__avg'] or 0

        return Response({
            'total_leads': total_leads,
            'total_clients': total_clients,
            'average_score': round(avg_score, 2),
        })
