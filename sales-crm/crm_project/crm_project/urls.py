from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from clients_leads.views import CompanyInfoViewSet

router = DefaultRouter()
router.register(r'companies', CompanyInfoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
