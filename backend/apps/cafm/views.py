from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Facility, Space, Asset, MaintenanceRequest, MaintenanceLog
from .serializers import (
    FacilitySerializer,
    SpaceSerializer,
    AssetSerializer,
    MaintenanceRequestSerializer,
    MaintenanceLogSerializer
)

class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all().order_by('-created_at')
    serializer_class = FacilitySerializer
    permission_classes = [IsAuthenticated]

class SpaceViewSet(viewsets.ModelViewSet):
    queryset = Space.objects.all().order_by('-created_at')
    serializer_class = SpaceSerializer
    permission_classes = [IsAuthenticated]

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all().order_by('-created_at')
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]

class MaintenanceRequestViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceRequest.objects.all().order_by('-created_at')
    serializer_class = MaintenanceRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        old_status = instance.status
        new_instance = serializer.save()
        new_status = new_instance.status

        if old_status != new_status:
            MaintenanceLog.objects.create(
                request=new_instance,
                user=self.request.user,
                status_change=f"{old_status} -> {new_status}",
                comment=f"Status updated from {old_status} to {new_status}"
            )

class MaintenanceLogViewSet(viewsets.ModelViewSet):
    queryset = MaintenanceLog.objects.all().order_by('-created_at')
    serializer_class = MaintenanceLogSerializer
    permission_classes = [IsAuthenticated]
