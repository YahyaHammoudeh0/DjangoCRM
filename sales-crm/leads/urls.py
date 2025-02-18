from django.urls import path
from . import views

urlpatterns = [
    path('leads/', views.manage_leads, name='manage_leads'),
    path('leads/<int:pk>/score/', views.score_lead, name='score-lead'),
    path('leads/convert/', views.convert_lead_to_customer, name='convert_lead_to_customer'),
    path('customers/', views.manage_customers, name='manage_customers'),
    # Update this line to use the class-based view
    path('leads/<int:pk>/assign/', views.AssignLeadView.as_view(), name='assign-lead'),
]
