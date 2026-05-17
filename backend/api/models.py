import uuid
from django.db import models


class Vehicle(models.Model):
    """Maps to existing 'vehicles' table in Supabase."""

    ETAT_CHOICES = [
        ("disponible", "Disponible"),
        ("en mission", "En mission"),
        ("en panne", "En panne"),
        ("en maintenance", "En maintenance"),
        ("archivé", "Archivé"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    immatriculation = models.TextField()
    marque = models.TextField()
    modele = models.TextField()
    etat = models.TextField(choices=ETAT_CHOICES, default="disponible")
    kilometrage = models.IntegerField(default=0)
    km_prochain_entretien = models.IntegerField(default=0)
    seuil_maintenance = models.IntegerField(default=10000)
    last_maintenance_km = models.IntegerField(default=0)

    # GPS
    latitude = models.FloatField(default=33.5731)  # Default Casa
    longitude = models.FloatField(default=-7.5898)
    
    date_assurance = models.DateField(null=True, blank=True)
    date_visite_technique = models.DateField(null=True, blank=True)
    date_vignette = models.DateField(null=True, blank=True)

    class Meta:
        db_table = "vehicles"
        
    @property
    def maintenance_due(self):
        return self.kilometrage >= (self.last_maintenance_km + self.seuil_maintenance)
        managed = True 

    def __str__(self):
        return f"{self.immatriculation} — {self.marque} {self.modele}"


class Driver(models.Model):
    """Maps to existing 'drivers' table in Supabase."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nom = models.TextField()
    prenom = models.TextField()
    num_permis = models.TextField()
    disponible = models.BooleanField(default=True)

    class Meta:
        db_table = "drivers"
        managed = True

    def __str__(self):
        return f"{self.prenom} {self.nom}"


class Mission(models.Model):
    """Maps to existing 'missions' table in Supabase."""

    STATUT_CHOICES = [
        ("planifiée", "Planifiée"),
        ("en cours", "En cours"),
        ("terminée", "Terminée"),
        ("annulée", "Annulée"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicle = models.ForeignKey(
        Vehicle, on_delete=models.SET_NULL, null=True, db_column="vehicle_id"
    )
    driver = models.ForeignKey(
        Driver, on_delete=models.SET_NULL, null=True, db_column="driver_id"
    )
    description = models.TextField(blank=True, default="")
    statut = models.TextField(choices=STATUT_CHOICES, default="planifiée")

    consommation_litres = models.FloatField(default=0.0)
    cout_carburant = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    km_depart = models.IntegerField(default=0)
    km_arrivee = models.IntegerField(default=0)

    ville_depart = models.CharField(max_length=100, default="Casablanca")
    ville_arrivee = models.CharField(max_length=100, default="Tanger")

    class Meta:
        db_table = "missions"
        managed = True

    def clean(self):
        super().clean()
        if self.vehicle and self.vehicle.etat == "en maintenance" and self.pk is None:
            from django.core.exceptions import ValidationError
            raise ValidationError("Cannot assign a vehicle in maintenance to a new mission.")

    def __str__(self):
        return f"Mission {self.id} — {self.statut}"


class Maintenance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    vehicule = models.ForeignKey(
        Vehicle, on_delete=models.CASCADE, db_column="vehicule_id"
    )
    type_intervention = models.TextField()
    date_maintenance = models.DateField()
    cout = models.DecimalField(max_digits=10, decimal_places=2)
    pieces_rechange = models.TextField(blank=True, default="")
    prestataire_garage = models.TextField(blank=True, default="")
    notes = models.TextField(blank=True, default="")

    class Meta:
        db_table = "maintenances"
        managed = True

    def __str__(self):
        return f"Maintenance {self.id} - {self.vehicule}"

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Mission)
def update_vehicle_driver_status(sender, instance, created, **kwargs):
    if instance.vehicle and instance.driver:
        if instance.statut == "en cours":
            instance.vehicle.etat = "en mission"
            instance.vehicle.save(update_fields=["etat"])
            instance.driver.disponible = False
            instance.driver.save(update_fields=["disponible"])
        elif instance.statut == "terminée":
            instance.vehicle.etat = "disponible"
            instance.vehicle.save(update_fields=["etat"])
            instance.driver.disponible = True
            instance.driver.save(update_fields=["disponible"])

# Coords mapping for simulation
CITY_COORDS = {
    "Casablanca": [33.5731, -7.5898],
    "Tanger": [35.7595, -5.8340],
    "Marrakech": [31.6295, -7.9811],
    "Agadir": [30.4278, -9.5981],
    "Fès": [34.0181, -5.0078],
    "Rabat": [34.0209, -6.8416],
    "Oujda": [34.6805, -1.9076],
    "Tétouan": [35.5889, -5.3626],
    "Laâyoune": [27.1500, -13.2000],
    "Dakhla": [23.6844, -15.9579],
}
