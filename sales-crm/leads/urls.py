from django.urls import path
from . import views

urlpatterns = [
    path('leads/', views.manage_leads, name='manage_leads'),  # Add this endpoint for lead management
    path('leads/<int:pk>/score/', views.score_lead, name='score-lead'),
    path('leads/convert/', views.convert_lead_to_customer, name='convert_lead_to_customer'),
    path('customers/', views.manage_customers, name='manage_customers'),
]
