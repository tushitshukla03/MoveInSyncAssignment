# accounts/views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import AccountSerializer
from rest_framework.permissions import AllowAny


@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to access this endpoint
def register_user(request):
    print("hello")
    serializer = AccountSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User registered successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT'])
def account_detail(request):
    user = request.user
    if request.method == 'GET':
        serializer = AccountSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'PUT':
        serializer = AccountSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
