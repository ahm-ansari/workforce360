# permissions.py

from rest_framework import permissions, viewsets

from .models import RolePermission, UserProfile
from .serializers import RecruitmentPlanSerializer
from recruitment.models import RecruitmentPlan


class HasRolePermission(permissions.BasePermission):
    """
    Custom permission to check if the user has a specific required permission code.
    Example: permission_required = 'recruitment:create_plan'
    """
    def __init__(self, permission_required):
        self.permission_required = permission_required

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        try:
            # Check the permissions associated with the user's roles
            user_profile = request.user.userprofile
            
            # Efficiently check if *any* of the user's roles grants the required permission
            has_perm = RolePermission.objects.filter(
                role__in=user_profile.roles.all(),
                permission__code_name=self.permission_required
            ).exists()

            return has_perm
        
        except UserProfile.DoesNotExist:
            return False

# Example Usage in a View
class RecruitmentPlanViewSet(viewsets.ModelViewSet):
    queryset = RecruitmentPlan.objects.all()
    serializer_class = RecruitmentPlanSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            # Requires the 'recruitment:edit_plan' permission
            return [HasRolePermission('recruitment:edit_plan')]
        # Default for list/retrieve
        return [HasRolePermission('recruitment:view_plan')]