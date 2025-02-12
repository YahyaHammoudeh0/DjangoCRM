from django.shortcuts import render

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Person
from .serializers import PersonSerializer

@api_view(['GET'])
def get_people(request):
    people = Person.objects.all()
    serializer = PersonSerializer(people, many=True)
    return Response(serializer.data)
