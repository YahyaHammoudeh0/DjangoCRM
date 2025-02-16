from django.contrib import admin
from django.urls import path
from leads import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/customers/', views.manage_customers, name='manage_customers'),
    path('api/leads/', views.manage_leads, name='manage_leads'),
    path('api/leads/convert/', views.convert_lead_to_customer, name='convert_lead'),
    path('api/leads/<int:pk>/score/', views.score_lead, name='score_lead'),
]
