from django.db import models

# Create your models here.
class Donation(models.Model):
    value = models.IntegerField(default=0)
    date = models.CharField(max_length=50, null=True, blank=True)

class Promo(models.Model):
    value = models.DecimalField(default=0,max_digits=5, decimal_places=2)
    date = models.CharField(max_length=50, null=True, blank=True)