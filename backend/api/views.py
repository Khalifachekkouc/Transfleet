from rest_framework import viewsets, filters, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Vehicle, Driver, Mission, Maintenance
from .serializers import VehicleSerializer, DriverSerializer, MissionSerializer, MaintenanceSerializer


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["immatriculation", "marque", "modele"]
    permission_classes = [permissions.AllowAny]


class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["nom", "prenom", "num_permis"]
    permission_classes = [permissions.IsAuthenticated]


class MissionViewSet(viewsets.ModelViewSet):
    queryset = Mission.objects.select_related("vehicle", "driver").all()
    serializer_class = MissionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["statut", "description"]
    permission_classes = [permissions.AllowAny]

class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.select_related("vehicule").all()
    serializer_class = MaintenanceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["type_intervention", "notes"]


@api_view(["GET"])
def stats_view(request):
    """Dashboard aggregate counts."""
    from django.db.models import Sum
    total_vehicles = Vehicle.objects.count()
    available_vehicles = Vehicle.objects.filter(etat="disponible").count()
    active_missions = Mission.objects.filter(statut="en cours").count()
    total_drivers = Driver.objects.count()
    available_drivers = Driver.objects.filter(disponible=True).count()
    
    total_maintenance_cost = Maintenance.objects.aggregate(Sum("cout"))["cout__sum"] or 0
    total_fuel_cost = Mission.objects.aggregate(Sum("cout_carburant"))["cout_carburant__sum"] or 0

    import datetime
    today = datetime.date.today()
    warning_date = today + datetime.timedelta(days=15)
    
    from django.db.models import Q, F
    document_alerts = Vehicle.objects.filter(
        Q(date_assurance__lt=warning_date) | 
        Q(date_visite_technique__lt=warning_date) | 
        Q(date_vignette__lt=warning_date) |
        Q(date_assurance__isnull=True) |
        Q(date_visite_technique__isnull=True) |
        Q(date_vignette__isnull=True)
    ).count()
    
    maintenance_alerts = Vehicle.objects.filter(
        kilometrage__gte=F('last_maintenance_km') + F('seuil_maintenance')
    ).count()

    return Response(
        {
            "total_vehicles": total_vehicles,
            "available_vehicles": available_vehicles,
            "active_missions": active_missions,
            "total_drivers": total_drivers,
            "available_drivers": available_drivers,
            "total_maintenance_cost": total_maintenance_cost,
            "total_fuel_cost": total_fuel_cost,
            "document_alerts": document_alerts,
            "maintenance_alerts": maintenance_alerts,
        }
    )
