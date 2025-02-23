from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('leads.urls')),
    path('api/employee/', include('employee.urls')),
    path('api/', include('invoices.urls')),
    path('api/settings/', include('settings.urls')),  # Added settings API endpoint
]
