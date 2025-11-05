# employees/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployeeViewSet
from .views import EmployeeListAll

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/employee/all/', EmployeeListAll.as_view(), name='employee-list-all'),
]