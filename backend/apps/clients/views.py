from rest_framework import viewsets, permissions
from .models import Client, ClientContact, ClientSite
from .serializers import ClientSerializer, ClientListSerializer, ClientContactSerializer, ClientSiteSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['client_type', 'status', 'account_manager', 'industry']
    search_fields = ['name', 'email', 'phone', 'industry', 'tax_id']
    ordering_fields = ['name', 'created_at', 'joined_date']

    def get_serializer_class(self):
        if self.action == 'list':
            return ClientListSerializer
        return ClientSerializer

class ClientContactViewSet(viewsets.ModelViewSet):
    queryset = ClientContact.objects.all()
    serializer_class = ClientContactSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['client', 'is_primary']
    search_fields = ['first_name', 'last_name', 'email', 'phone']

class ClientSiteViewSet(viewsets.ModelViewSet):
    queryset = ClientSite.objects.all()
    serializer_class = ClientSiteSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['client', 'site_type']
    search_fields = ['site_name', 'address', 'city', 'country']
