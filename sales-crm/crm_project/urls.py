from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from clients_leads.views import CompanyInfoViewSet

router = DefaultRouter()
router.register(r'companies', CompanyInfoViewSet, basename='company')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('', include('clients_leads.urls')),  # This will include your app URLs
]
