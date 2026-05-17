from django.contrib import admin
from .models import Vehicle, Driver, Mission

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('immatriculation', 'marque', 'modele', 'etat', 'kilometrage')
    list_filter = ('etat',)
    search_fields = ('immatriculation', 'marque')

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('nom', 'prenom', 'num_permis', 'disponible')
    list_filter = ('disponible',)
    search_fields = ('nom', 'num_permis')

@admin.register(Mission)
class MissionAdmin(admin.ModelAdmin):
    list_display = ('id', 'vehicle', 'driver', 'statut')
    list_filter = ('statut',)