from django.urls import include, path
from .views import donation#, api_donation, payment_done,payment_cancelled

urlpatterns = [
    path('donation-mail/',donation,name='donation'),
    #path('donation/',api_donation,name='donation'),
    #path('payment_done',payment_done,name='payment_done'),
    #path('payment_cancelled', payment_cancelled, name='payment_cancelled'),
    ]