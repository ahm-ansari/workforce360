from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.users.models import Role, Notification

User = get_user_model()

class UsersModuleTests(TestCase):
    def setUp(self):
        self.role_admin = Role.objects.create(name="Admin", description="Administrator")
        self.user = User.objects.create_user(
            username="testuser", 
            password="password123",
            role=self.role_admin
        )

    def test_user_creation_with_role(self):
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.role.name, "Admin")

    def test_notification_creation(self):
        notification = Notification.objects.create(
            user=self.user,
            title="Test Notification",
            message="This is a test",
            notification_type="GENERAL"
        )
        self.assertEqual(notification.user, self.user)
        self.assertFalse(notification.is_read)
        self.assertEqual(self.user.notifications.count(), 1)
