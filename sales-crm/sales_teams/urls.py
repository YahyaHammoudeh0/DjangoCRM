from django.urls import path
from .views import get_people

urlpatterns = [
    path('api/people/', get_people, name='people'),
]
