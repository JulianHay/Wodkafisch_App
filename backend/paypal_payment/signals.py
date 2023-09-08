from django.shortcuts import get_object_or_404
#from paypal.standard.ipn.signals import valid_ipn_received
from django.dispatch import receiver
from .models import Donation

#@receiver(valid_ipn_received)
def payment_notification(sender, **kwargs):
    ipn = sender
    if ipn.payment_status == 'Completed':
        Donation.object.create()
        # payment was successful
        #order = get_object_or_404(Order, id=ipn.invoice)

        #if order.total_cost() == ipn.mc_gross:
        #    # mark the order as paid
        #    order.paid = True
        #    order.save()