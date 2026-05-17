from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VehicleViewSet, DriverViewSet, MissionViewSet, MaintenanceViewSet, stats_view

router = DefaultRouter()
router.register(r"vehicles", VehicleViewSet, basename="vehicle")
router.register(r"drivers", DriverViewSet, basename="driver")
router.register(r"missions", MissionViewSet, basename="mission")
router.register(r"maintenances", MaintenanceViewSet, basename="maintenance")

urlpatterns = [
    path("", include(router.urls)),
    path("stats/", stats_view, name="stats"),
]
