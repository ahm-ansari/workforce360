from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/', include('apps.users.urls')),
    path('api/employees/', include('apps.employees.urls')),
    path('api/hr/', include('apps.hr.urls')),
    path('api/tasks/', include('apps.tasks.urls')),
    path('api/finance/', include('apps.finance.urls')),
    path('api/recruitment/', include('apps.recruitment.urls')),
    path('api/visitors/', include('apps.visitors.urls')),
    path('api/projects/', include('apps.projects.urls')),
    path('api/outsourcing/', include('apps.outsourcing.urls')),
    path('api/clients/', include('apps.clients.urls')),
    path('api/marketing/', include('apps.marketing.urls')),
    path('api/sales/', include('apps.sales.urls')),
    path('api/operations/', include('apps.operations.urls')),
    path('api/cafm/', include('apps.cafm.urls')),
    path('api/analysis/', include('apps.analysis.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
