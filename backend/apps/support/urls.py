from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketCategoryViewSet, SupportTicketViewSet

router = DefaultRouter()
router.register(r'categories', TicketCategoryViewSet)
router.register(r'tickets', SupportTicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
