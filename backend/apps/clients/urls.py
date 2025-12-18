from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, ClientContactViewSet, ClientSiteViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'contacts', ClientContactViewSet)
router.register(r'sites', ClientSiteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
