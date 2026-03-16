from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketCategoryViewSet, SupportTicketViewSet, EscalationMatrixViewSet

router = DefaultRouter()
router.register(r'categories', TicketCategoryViewSet)
router.register(r'tickets', SupportTicketViewSet)
router.register(r'escalation-matrix', EscalationMatrixViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
