from django.urls import path
from . import views  # ✅ Correct import

urlpatterns = [
    path('customers/', views.manage_customers, name='manage_customers'),
    path('convert-lead/', views.convert_lead_to_customer, name='convert_lead_to_customer'),
]
