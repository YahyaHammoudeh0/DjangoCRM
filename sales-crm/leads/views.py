from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Lead, Customer
from .serializers import LeadSerializer, CustomerSerializer, LeadToCustomerSerializer
from .baml_client.sync_client import b
from .baml_client.types import LeadInfo, LeadExamples
import os
from dotenv import load_dotenv
from pathlib import Path
from .baml_client import reset_baml_env_vars

# Load environment variables
load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
reset_baml_env_vars(dict(os.environ))

@api_view(['GET', 'POST'])
def manage_customers(request):
    if request.method == 'POST':
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    customers = Customer.objects.all()
    serializer = CustomerSerializer(customers, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def manage_leads(request):
    if request.method == 'POST':
        serializer = LeadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    leads = Lead.objects.all()
    serializer = LeadSerializer(leads, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def convert_lead_to_customer(request):
    serializer = LeadToCustomerSerializer(data=request.data)
    if serializer.is_valid():
        customer = serializer.save()
        return Response(CustomerSerializer(customer).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def score_lead(request, pk):
    try:
        lead = Lead.objects.get(pk=pk)
        
        # Create LeadInfo object - remove companyNeeds which isn't in the model
        lead_info = LeadInfo(
            companyName=lead.company_name or "",  # Add default values for null fields
            industry=lead.industry or "",
            employeeCount=lead.employee_count or 0,
            budgetEstimate=float(lead.budget_estimate or 0),  # Convert to float explicitly
            country=lead.country or "",
            description=lead.description or ""
        )
        
        # Create example leads (you might want to store these somewhere else)
        lead_examples = LeadExamples(
            amazingLeads=[
                LeadInfo(
                    companyName="Tech Innovators",
                    industry="Technology",
                    employeeCount=500,
                    budgetEstimate=1000000.0,
                    country="USA",
                    description="A leading tech company focusing on innovative solutions.",
                    expectedScore=95.0
                )
            ],
            
            decentLeads=[
                LeadInfo(
                    companyName="Local Grocers",
                    industry="Retail",
                    employeeCount=50,
                    budgetEstimate=10000.0,
                    country="Canada",
                    description="A chain of local grocery stores.",
                    expectedScore=70.0
                )
            ],
            terribleLeads=[
                LeadInfo(
                    companyName="Struggling Startups",
                    industry="Various",
                    employeeCount=5,
                    budgetEstimate=1000.0,
                    country="Brazil",
                    description="A group of startups struggling to get off the ground.",
                    expectedScore=30.0
                )
            ]
        )
        
        # Score the lead using BAML client
        result = b.ScoreTheLead(lead_info, lead_examples)
        
        # Update lead score
        lead.score = result.lead_score
        lead.save()
        
        return Response({'score': result.lead_score}, status=status.HTTP_200_OK)
        
    except Lead.DoesNotExist:
        return Response({'error': 'Lead not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
