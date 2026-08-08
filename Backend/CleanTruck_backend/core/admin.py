from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Route, PickupRequest, CollectionHistory, Notification

admin.site.register(User, UserAdmin)
admin.site.register(Route)
admin.site.register(PickupRequest)
admin.site.register(CollectionHistory)
admin.site.register(Notification)
