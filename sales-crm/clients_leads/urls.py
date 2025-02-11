from django.urls import path
from . import views

app_name = 'clients_leads'

urlpatterns = [
    path('', views.index, name='index'),
    path('leads/', views.leads_list, name='leads-list'),
    path('clients/', views.clients_list, name='clients-list'),
]
