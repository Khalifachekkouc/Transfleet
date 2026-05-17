from rest_framework import serializers
from .models import Vehicle, Driver, Mission, Maintenance


class VehicleSerializer(serializers.ModelSerializer):
    maintenance_due = serializers.ReadOnlyField()

    class Meta:
        model = Vehicle
        fields = "__all__"


class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = "__all__"


class MissionSerializer(serializers.ModelSerializer):
    # Nested read-only representations
    vehicle_detail = VehicleSerializer(source="vehicle", read_only=True)
    driver_detail = DriverSerializer(source="driver", read_only=True)
    distance_parcourue = serializers.SerializerMethodField()

    class Meta:
        model = Mission
        fields = "__all__"
        
    def get_distance_parcourue(self, obj):
        return (obj.km_arrivee or 0) - (obj.km_depart or 0)
class MaintenanceSerializer(serializers.ModelSerializer):
    vehicule_detail = VehicleSerializer(source="vehicule", read_only=True)
    
    class Meta:
        model = Maintenance
        fields = "__all__"
