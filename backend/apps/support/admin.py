from django.contrib import admin
from .models import TicketCategory, SupportTicket, TicketMessage, EscalationMatrix

@admin.register(TicketCategory)
class TicketCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'icon')
    search_fields = ('name',)

class TicketMessageInline(admin.TabularInline):
    model = TicketMessage
    extra = 1

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_id', 'title', 'user', 'department', 'status', 'priority', 'created_at')
    list_filter = ('status', 'priority', 'category', 'department')
    search_fields = ('ticket_id', 'title', 'description', 'user__username')
    inlines = [TicketMessageInline]
    readonly_fields = ('ticket_id', 'created_at', 'updated_at')

@admin.register(EscalationMatrix)
class EscalationMatrixAdmin(admin.ModelAdmin):
    list_display = ('department', 'level', 'name', 'phone', 'email')
    list_filter = ('department', 'level')
